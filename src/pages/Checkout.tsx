import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { CreditCard, Wallet, Banknote, Truck } from 'lucide-react';

type PaymentMethod = 'card' | 'upi' | 'cod' | 'netbanking';

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCard className="text-blue-600" size={24} />,
    description: 'Pay securely with your card'
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: <Wallet className="text-green-600" size={24} />,
    description: 'Google Pay, PhonePe, Paytm & more'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: <Banknote className="text-purple-600" size={24} />,
    description: 'All major banks available'
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: <Truck className="text-orange-600" size={24} />,
    description: 'Pay when you receive'
  }
];

export function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useStore();
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Process payment and order
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/order-confirmation');
    }
  };

  const renderPaymentForm = () => {
    switch (selectedPayment) {
      case 'card':
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
          </div>
        );
      case 'upi':
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="upiId"
              placeholder="UPI ID (e.g., name@upi)"
              value={formData.upiId}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        );
      case 'netbanking':
        return (
          <div className="space-y-4">
            <select className="w-full border p-2 rounded">
              <option value="">Select Bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
            </select>
          </div>
        );
      case 'cod':
        return (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              Cash on delivery charges may apply. Please keep exact change ready at the time of delivery.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        {['Shipping', 'Review', 'Payment'].map((label, index) => (
          <div
            key={label}
            className={`flex items-center ${
              index < step ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                index < step ? 'border-blue-600 bg-blue-600 text-white' : ''
              }`}
            >
              {index + 1}
            </div>
            <span className="ml-2">{label}</span>
            {index < 2 && (
              <div
                className={`w-24 h-0.5 mx-4 ${
                  index < step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="col-span-2 border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border p-2 rounded"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="col-span-2 border p-2 rounded"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="pincode"
                placeholder="PIN Code"
                value={formData.pincode}
                onChange={handleInputChange}
                required
                className="border p-2 rounded"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Review Order</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">Payment Method</h2>
            
            <div className="grid gap-4">
              {PAYMENT_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPayment === option.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={selectedPayment === option.id}
                    onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                    className="mr-4"
                  />
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <div>
                      <div className="font-medium">{option.name}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6">
              {renderPaymentForm()}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-[#2874f0] text-white rounded hover:bg-blue-600 ml-auto"
          >
            {step === 3 ? 'Place Order' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}