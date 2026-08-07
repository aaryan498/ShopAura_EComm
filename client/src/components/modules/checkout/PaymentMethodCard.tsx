'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

const PaymentMethodCard = ({ 
    method, 
    selectedMethod, 
    onSelect ,
    icon,
    title,
    description,
    children,
}: { 
    method: string; 
    selectedMethod: string; 
    onSelect: (method: string) => void; 
    icon: React.ReactNode;
    title: string;
    description?: string;
    children: React.ReactNode;
}) => {

    const isSelected = selectedMethod === method;

    // Placeholder for icons, can be expanded for other payment methods
    const getIcon = (methodName: string) => {
        switch (methodName) {
            case 'stripe':
                return <FiCreditCard className="text-2xl md:text-3xl text-primary" />;
            default:
                return <FiCreditCard className="text-2xl md:text-3xl text-muted-foreground" />;
        }
    };


  return (
    <div
      className={`bg-card border-2 rounded-lg p-4 mb-4 cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-primary shadow-lg' : 'border-border hover:border-muted'
      }`}
      onClick={() => onSelect(method)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getIcon(method)}
          <div className="ml-4">
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <FiCheckCircle className="text-primary text-2xl" />
          </motion.div>
        )}
      </div>

      {method === 'stripe' && (
        <div className="flex items-center mt-3 space-x-2 text-muted-foreground">
          <FaCcVisa className="text-2xl" />
          <FaCcMastercard className="text-2xl" />
          <FaCcAmex className="text-2xl" />
        </div>
      )}

      {isSelected && children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 pt-4 border-t border-border"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default PaymentMethodCard;



//     <div onClick={() => onSelect(method)}>
//       <div>
//         {
//             method === 'stripe' && (
//                 <div>
//                     <div>visa</div>
//                     <div>mastercard</div>
//                     <div>amex</div>
//                 </div>
//             )
//         }
//       </div>
//       {
//         isSelected && children && (
//             <motion.div>
//                 {children}
//             </motion.div>
//         )
//       }
//     </div>
//   );
// };

// export default PaymentMethodCard;