const express = require('express');
const User = require('../models/User');
const Request = require('../models/Request');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/payments/wallet
// @desc    Obtener información de la wallet del usuario
// @access  Private
router.get('/wallet', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wallet.transactions')
      .select('wallet');

    res.json({
      success: true,
      data: {
        balance: user.wallet.balance,
        transactions: user.wallet.transactions || []
      }
    });

  } catch (error) {
    console.error('Error obteniendo wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/payments/deposit
// @desc    Depositar dinero en la wallet
// @access  Private
router.post('/deposit', authenticateToken, async (req, res) => {
  try {
    const { amount, method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Monto válido es requerido'
      });
    }

    if (!method || !['card', 'bank_transfer', 'cash'].includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Método de pago válido es requerido'
      });
    }

    // TODO: Integrar con pasarela de pagos real
    // Por ahora simulamos el proceso

    // Crear transacción
    const transaction = {
      type: 'deposit',
      amount: amount,
      method: method,
      status: 'completed',
      description: `Depósito de $${amount}`,
      timestamp: new Date()
    };

    // Actualizar balance del usuario
    const user = await User.findById(req.user._id);
    user.wallet.balance += amount;
    user.wallet.transactions.push(transaction);
    await user.save();

    res.json({
      success: true,
      message: 'Depósito realizado exitosamente',
      data: {
        newBalance: user.wallet.balance,
        transaction
      }
    });

  } catch (error) {
    console.error('Error realizando depósito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/payments/withdraw
// @desc    Retirar dinero de la wallet
// @access  Private
router.post('/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount, method, accountInfo } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Monto válido es requerido'
      });
    }

    if (!method || !['bank_transfer', 'paypal'].includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Método de retiro válido es requerido'
      });
    }

    const user = await User.findById(req.user._id);

    if (user.wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Saldo insuficiente'
      });
    }

    // TODO: Integrar con servicio de retiros real
    // Por ahora simulamos el proceso

    // Crear transacción
    const transaction = {
      type: 'withdrawal',
      amount: -amount,
      method: method,
      status: 'pending',
      description: `Retiro de $${amount}`,
      accountInfo: accountInfo,
      timestamp: new Date()
    };

    // Actualizar balance del usuario
    user.wallet.balance -= amount;
    user.wallet.transactions.push(transaction);
    await user.save();

    res.json({
      success: true,
      message: 'Solicitud de retiro procesada',
      data: {
        newBalance: user.wallet.balance,
        transaction
      }
    });

  } catch (error) {
    console.error('Error procesando retiro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/payments/pay-request
// @desc    Pagar una solicitud de servicio
// @access  Private
router.post('/pay-request', authenticateToken, async (req, res) => {
  try {
    const { requestId, method = 'wallet' } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: 'ID de solicitud es requerido'
      });
    }

    const request = await Request.findById(requestId)
      .populate('provider', 'firstName lastName');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar que el usuario es el cliente de la solicitud
    if (request.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para pagar esta solicitud'
      });
    }

    if (request.payment.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud ya ha sido pagada'
      });
    }

    const amount = request.pricing.finalPrice || request.pricing.estimatedPrice;

    if (method === 'wallet') {
      // Pago con wallet
      const user = await User.findById(req.user._id);

      if (user.wallet.balance < amount) {
        return res.status(400).json({
          success: false,
          message: 'Saldo insuficiente en la wallet'
        });
      }

      // Crear transacción de pago
      const paymentTransaction = {
        type: 'payment',
        amount: -amount,
        method: 'wallet',
        status: 'completed',
        description: `Pago por servicio: ${request.serviceDetails.description}`,
        requestId: request._id,
        timestamp: new Date()
      };

      // Actualizar balance del cliente
      user.wallet.balance -= amount;
      user.wallet.transactions.push(paymentTransaction);
      await user.save();

      // Crear transacción de ingreso para el proveedor
      const provider = await User.findById(request.provider);
      const incomeTransaction = {
        type: 'income',
        amount: amount * 0.85, // 85% para el proveedor, 15% comisión
        method: 'wallet',
        status: 'completed',
        description: `Ingreso por servicio: ${request.serviceDetails.description}`,
        requestId: request._id,
        timestamp: new Date()
      };

      provider.wallet.balance += incomeTransaction.amount;
      provider.wallet.transactions.push(incomeTransaction);
      await provider.save();

      // Actualizar estado de pago de la solicitud
      request.payment.status = 'paid';
      request.payment.method = 'wallet';
      request.payment.paidAt = new Date();
      await request.save();

      res.json({
        success: true,
        message: 'Pago realizado exitosamente',
        data: {
          newBalance: user.wallet.balance,
          transaction: paymentTransaction
        }
      });

    } else {
      // Pago con tarjeta u otro método
      // TODO: Integrar con pasarela de pagos
      
      // Simular proceso de pago
      const transaction = {
        type: 'payment',
        amount: -amount,
        method: method,
        status: 'completed',
        description: `Pago por servicio: ${request.serviceDetails.description}`,
        requestId: request._id,
        timestamp: new Date()
      };

      // Actualizar estado de pago de la solicitud
      request.payment.status = 'paid';
      request.payment.method = method;
      request.payment.paidAt = new Date();
      await request.save();

      res.json({
        success: true,
        message: 'Pago procesado exitosamente',
        data: {
          transaction
        }
      });
    }

  } catch (error) {
    console.error('Error procesando pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/payments/transactions
// @desc    Obtener historial de transacciones
// @access  Private
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    const user = await User.findById(req.user._id)
      .populate('wallet.transactions')
      .select('wallet');

    let transactions = user.wallet.transactions || [];

    // Filtrar por tipo si se especifica
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    // Ordenar por fecha (más recientes primero)
    transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedTransactions = transactions.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: transactions.length,
          pages: Math.ceil(transactions.length / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/payments/request/:requestId
// @desc    Obtener información de pago de una solicitud
// @access  Private
router.get('/request/:requestId', authenticateToken, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId)
      .select('pricing payment client provider');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar que el usuario tiene acceso a esta información
    if (request.client.toString() !== req.user._id.toString() && 
        request.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta información'
      });
    }

    res.json({
      success: true,
      data: {
        pricing: request.pricing,
        payment: request.payment
      }
    });

  } catch (error) {
    console.error('Error obteniendo información de pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/payments/refund
// @desc    Solicitar reembolso
// @access  Private
router.post('/refund', authenticateToken, async (req, res) => {
  try {
    const { requestId, reason } = req.body;

    if (!requestId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'ID de solicitud y razón son requeridos'
      });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar que el usuario es el cliente de la solicitud
    if (request.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para solicitar reembolso de esta solicitud'
      });
    }

    if (request.payment.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud debe estar pagada para solicitar reembolso'
      });
    }

    // TODO: Implementar lógica de reembolso real
    // Por ahora solo marcamos como reembolsado

    request.payment.status = 'refunded';
    await request.save();

    res.json({
      success: true,
      message: 'Solicitud de reembolso procesada'
    });

  } catch (error) {
    console.error('Error procesando reembolso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 