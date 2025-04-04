import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card, ListGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import debounce from "lodash.debounce"; // Import lodash for debouncing

const schema = yup.object().shape({
  billAccountNo: yup.string().required("Bill account number is required"),
  amount: yup.number().required("Amount is required").positive().max(200000),
  paymentMethod: yup
    .string()
    .required("Payment method is required")
    .oneOf(["card", "bank_transfer", "mobile_wallet"]),
});

const App = () => {
  const [step, setStep] = useState(1);
  const [billers, setBillers] = useState([
    {
      id: 1,
      name: "Electricity Board",
      description:
        "Pay your electricity bill for residential or commercial use.",
      accountNumber: "1234567890",
    },
    {
      id: 2,
      name: "Water Supply Company",
      description: "Monthly water supply bill payment service.",
      accountNumber: "1234568899",
    },
    {
      id: 3,
      name: "Internet Provider",
      description: "Broadband and fiber internet bill payment.",
      accountNumber: "1234567777",
    },
    {
      id: 4,
      name: "Mobile Network Operator",
      description:
        "Recharge and postpaid bill payments for your mobile connection.",
      accountNumber: "3334567890",
    },
    {
      id: 5,
      name: "Gas Utility Company",
      description: "Natural gas bill payment for households and businesses.",
      accountNumber: "1234584444",
    },
  ]);
  const [selectedBiller, setSelectedBiller] = useState(null);
  const [billDetails, setBillDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    fetchBillers();
  }, []);

  console.log(selectedBiller?.id);
  // Fetch billers from API (default or search)
  const fetchBillers = async (query = "") => {
    try {
      const response = await axios.get("/api/billers", {
        params: { search: query },
      });
      setBillers(Array.isArray(response.data) ? response.data : billers);
    } catch (error) {
      console.error("Error fetching billers:", error);
      setBillers([]);
    }
  };

  // Debounced search function
  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
    fetchBillers(value);
  }, 300);

  // Select a biller
  const selectBiller = (biller) => {
    setSelectedBiller(biller);
    setValue("billerName", biller.name);
    setStep(2);
  };

  // Fetch bill details from API
  const fetchBillDetails = async () => {
    try {
      const accountNo = getValues("billAccountNo");
      const response = await axios.get(`/api/bills/details`, {
        params: { billerId: selectedBiller.id, accountNo },
      });
      setBillDetails(response.data);
      setValue("amount", response.data.amount);
      setStep(3);
    } catch (error) {
      console.error("Error fetching bill details:", error);
    }
  };

  // Submit payment
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/bills/pay", {
        ...data,
        billerId: selectedBiller.id,
        billDetails: billDetails,
      });
      console.log("Payment successful:", response.data);
      alert("Payment successful!");
      setStep(1); // Reset to first step after payment
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  // Render steps
  const renderStep = () => {
    switch (step) {
      case 1: // Step 1: Search Biller
        return (
          <>
            <Form.Group>
              <Form.Label>Search Biller</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type to search..."
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </Form.Group>
            <ListGroup>
              {billers.length > 0 ? (
                billers.map((biller) => (
                  <ListGroup.Item
                    key={biller.id}
                    action
                    onClick={() => selectBiller(biller)}
                  >
                    {biller.name}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No billers found.</ListGroup.Item>
              )}
            </ListGroup>
          </>
        );

      case 2: // Step 2: Enter Account Number
        return (
          <>
            <Card>
              <Card.Body>
                <Card.Title>{selectedBiller.name}</Card.Title>
                <Card.Text>{selectedBiller.description}</Card.Text>
              </Card.Body>
            </Card>
            <Form.Group>
              <Form.Label>Bill Account Number</Form.Label>
              <Form.Control
                type="text"
                {...register("billAccountNo")}
                value={selectedBiller.accountNumber}
              />
              {errors.billAccountNo && (
                <Alert variant="danger">{errors.billAccountNo.message}</Alert>
              )}
            </Form.Group>
            <Button onClick={fetchBillDetails}>Fetch Bill Details</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setStep(1);
                setSelectedBiller(null);
                setValue("billAccountNo", selectedBiller.accountNumber || "");
              }}
              className="ml-2"
            >
              Back
            </Button>
          </>
        );

      case 3: // Step 3: Payment
        return (
          <>
            <Card>
              <Card.Body>
                <Card.Title>Bill Details</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    Amount Due: ${billDetails.amount}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Due Date: {billDetails.dueDate}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" {...register("amount")} value={200} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Payment Method</Form.Label>
              <Form.Control as="select" {...register("paymentMethod")}>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_wallet">Mobile Wallet</option>
              </Form.Control>
              {errors.paymentMethod && (
                <Alert variant="danger">{errors.paymentMethod.message}</Alert>
              )}
            </Form.Group>
            <Button type="submit">Pay Bill</Button>
            <Button
              variant="secondary"
              onClick={() => setStep(2)}
              className="ml-2"
            >
              Back
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2>Bill Payment</h2>
      {renderStep()}
    </Form>
  );
};

export default App;
