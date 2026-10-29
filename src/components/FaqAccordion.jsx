import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { closeDisclosureOnEscape } from '../lib/detailsEscape';

const FaqAccordion = ({ items }) => (
  <div className="faq-accordion-list">
    {items.map(([question, answer]) => (
      <FaqItem key={question} question={question} answer={answer} />
    ))}
  </div>
);

const FaqItem = ({ question, answer }) => {
  const detailsRef = useRef(null);
  const answerRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  const animateClose = () => {
    const details = detailsRef.current;
    const answerElement = answerRef.current;
    if (!details?.open || !answerElement) return;

    answerElement.style.maxHeight = `${answerElement.scrollHeight}px`;
    void answerElement.offsetHeight;
    answerElement.classList.add('is-closing');
    answerElement.style.maxHeight = '0px';

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      details.open = false;
      answerElement.classList.remove('is-closing');
      answerElement.style.maxHeight = '';
    }, 320);
  };

  const animateOpen = () => {
    const details = detailsRef.current;
    const answerElement = answerRef.current;
    if (!details || !answerElement) return;

    window.clearTimeout(closeTimerRef.current);
    details.open = true;
    answerElement.classList.remove('is-closing');
    answerElement.style.maxHeight = '0px';
    void answerElement.offsetHeight;
    answerElement.style.maxHeight = `${answerElement.scrollHeight}px`;
  };

  const handleSummaryClick = (event) => {
    event.preventDefault();
    if (detailsRef.current?.open) {
      animateClose();
    } else {
      animateOpen();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && detailsRef.current?.open) {
      event.preventDefault();
      animateClose();
    } else {
      closeDisclosureOnEscape(event);
    }
  };

  return (
    <details
      ref={detailsRef}
      className="faq-disclosure"
      onKeyDown={handleKeyDown}
    >
      <summary onClick={handleSummaryClick}>
        <span>{question}</span>
        <ChevronDown className="faq-disclosure-chevron" aria-hidden="true" />
      </summary>
      <div ref={answerRef} className="faq-disclosure-answer">
        <p>{answer}</p>
      </div>
    </details>
  );
};

export default FaqAccordion;
