import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yup } from "yup";

const TransactionModal = ({ show, onHide, onSubmit }) => {
  const [step, setStep] = useState(1);
  const validationSchema = up.object().shape({
    amount: yup.number().required().positive().max(10000),
    toAccount: yup.string().required().length(10),
    transactionType: yup.string().required().oneOf(["transfer", "withdrawal"]),
    paymentMethod: yup
      .string()
      .required()
      .oneOf(["cash", "card", "bank_transfer", "mobile_wallet"]),
  });
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Form.Group>
            <Form.Label>Transaction Type</Form.Label>
            <Form.Control as="select" name="transactionType" ref={register}>
              <option value="transfer">Transfer</option>
              <option value="withdrawal">Withdrawal</option>
            </Form.Control>
          </Form.Group>
        );
      case 2:
        return (
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control type="number" name="amount" ref={register} />
            {errors.amount && (
              <Alert variant="danger">{errors.amount.message}</Alert>
            )}
          </Form.Group>
        );
      case 3:
        return (
          <Form.Group>
            <Form.Label>To Account (for transfers)</Form.Label>
            <Form.Control type="text" name="toAccount" ref={register} />
            {errors.toAccount && (
              <Alert variant="danger">{errors.toAccount.message}</Alert>
            )}
          </Form.Group>
        );
      case 4:
        return (
          <Form.Group>
            <Form.Label>Payment Method</Form.Label>
            <Form.Control as="select" name="paymentMethod" ref={register}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_wallet">Mobile Wallet</option>
            </Form.Control>
          </Form.Group>
        );
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>New Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderStep()}</Modal.Body>
        <Modal.Footer>
          {step > 1 && <Button onClick={prevStep}>Previous</Button>}
          {step < 4 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TransactionModal;
