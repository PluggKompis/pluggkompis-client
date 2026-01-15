import React from "react";

export const FaqPage: React.FC = () => {
  const faqs = [
    {
      question: "Hur bokar jag en tid?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      question: "Kostar det något?",
      answer: "Nej, all läxhjälp är helt gratis!",
    },
    {
      question: "Vilka ämnen får man hjälp med?",
      answer: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Vanliga frågor</h1>

      <div className="max-w-3xl space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="card">
            <h3 className="mb-2">{faq.question}</h3>
            <p className="text-neutral-secondary">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
