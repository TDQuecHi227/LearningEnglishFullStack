import React, { useRef, useState, useEffect } from 'react';

const OtpInput = ({ length = 6, value, onChange, error }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value === '') {
      setOtp(new Array(length).fill(''));
    }
  }, [value, length]);

  const handleChange = (e, index) => {
    const text = e.target.value;
    if (/[^0-9]/.test(text)) return; // Chỉ cho phép nhập số

    const newOtp = [...otp];
    newOtp[index] = text.substring(text.length - 1);
    
    setOtp(newOtp);
    
    // Create a fake event object to maintain compatibility with onChange handlers
    const fakeEvent = {
      target: {
        id: 'otpCode',
        value: newOtp.join('')
      }
    };
    onChange(fakeEvent);

    // Tự động chuyển sang ô tiếp theo
    if (text && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Quay lại ô trước đó nếu ô hiện tại đang trống
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        
        const fakeEvent = {
          target: { id: 'otpCode', value: newOtp.join('') }
        };
        onChange(fakeEvent);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length).replace(/[^0-9]/g, '');
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      const fakeEvent = {
        target: { id: 'otpCode', value: newOtp.join('') }
      };
      onChange(fakeEvent);
      
      // Focus vào ô cuối cùng được paste
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex].focus();
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between gap-2 p-3 bg-gray-50/60 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-inner">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)}
            value={data}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-12 h-14 text-center text-xl font-bold border ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-[#2f6345] focus:ring-[#e5ece8]'
            } rounded-xl shadow-sm focus:outline-none focus:ring-4 transition-all bg-white text-gray-800`}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default OtpInput;
