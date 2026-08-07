'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const CheckOutSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    {
      number: 1,
      title: 'Payment',
    },
    {
      number: 2,
      title: 'Processing',
    },
    {
      number: 3,
      title: 'Complete',
    },
  ];

  return (
    <div className="flex justify-center items-center py-8 px-4 bg-background">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <motion.div
            className={`flex flex-col items-center relative z-10 ${
              currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {currentStep > step.number ? (
              <FiCheckCircle className="text-2xl md:text-3xl mb-1" />
            ) : (
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${currentStep === step.number ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>{step.number}</div>
            )}
            <span className="text-xs md:text-sm mt-2 text-center">{step.title}</span>
          </motion.div>
          {index < steps.length - 1 && (
            <motion.div
              className={`flex-1 h-1 mx-2 md:mx-4 ${currentStep > step.number ? 'bg-primary' : 'bg-border'}`}
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.15 }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckOutSteps;