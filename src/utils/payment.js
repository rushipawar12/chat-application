// Payment processing utilities
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer'
};

// Simulate Stripe payment processing
export const processPayment = async (paymentData) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate payment validation
    if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvc) {
      throw new Error('Invalid payment details');
    }

    // Simulate card validation (basic)
    if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      throw new Error('Invalid card number');
    }

    if (paymentData.cvc.length < 3) {
      throw new Error('Invalid CVC');
    }

    // Simulate successful payment
    const transaction = {
      id: `txn_${Date.now()}`,
      amount: paymentData.amount,
      currency: 'USD',
      status: PAYMENT_STATUS.COMPLETED,
      paymentMethod: PAYMENT_METHODS.CARD,
      timestamp: new Date().toISOString(),
      customer: {
        name: paymentData.customerName,
        email: paymentData.customerEmail
      },
      product: paymentData.product
    };

    return {
      success: true,
      transaction,
      message: 'Payment processed successfully'
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Payment failed'
    };
  }
};

// Calculate tax and total
export const calculateTotal = (subtotal, taxRate = 0.1) => {
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Validate card details
export const validateCardDetails = (cardData) => {
  const errors = [];

  // Card number validation
  if (!cardData.number || cardData.number.replace(/\s/g, '').length !== 16) {
    errors.push('Invalid card number');
  }

  // Expiry date validation
  if (!cardData.expiry || !/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
    errors.push('Invalid expiry date (MM/YY format)');
  } else {
    const [month, year] = cardData.expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      errors.push('Card has expired');
    }
  }

  // CVC validation
  if (!cardData.cvc || cardData.cvc.length < 3) {
    errors.push('Invalid CVC');
  }

  // Cardholder name validation
  if (!cardData.name || cardData.name.trim().length < 2) {
    errors.push('Invalid cardholder name');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Save transaction to local storage
export const saveTransaction = (transaction) => {
  try {
    const existingTransactions = JSON.parse(localStorage.getItem('chatAppTransactions') || '[]');
    existingTransactions.push(transaction);
    localStorage.setItem('chatAppTransactions', JSON.stringify(existingTransactions));
    return true;
  } catch (error) {
    console.error('Failed to save transaction:', error);
    return false;
  }
};

// Get transaction history
export const getTransactionHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('chatAppTransactions') || '[]');
  } catch (error) {
    console.error('Failed to load transaction history:', error);
    return [];
  }
};

// Generate receipt
export const generateReceipt = (transaction) => {
  return {
    receiptNumber: `RCP-${Date.now()}`,
    transactionId: transaction.id,
    date: transaction.timestamp,
    customer: transaction.customer,
    items: [
      {
        name: transaction.product.name,
        description: transaction.product.description,
        price: transaction.amount
      }
    ],
    subtotal: transaction.amount,
    tax: transaction.amount * 0.1,
    total: transaction.amount * 1.1,
    status: transaction.status
  };
};
