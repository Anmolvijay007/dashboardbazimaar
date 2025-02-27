import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Drawer, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const AllUsers = () => {
  const [transactions, setTransactions] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [addMoney, setAddMoney] = useState(null);
  const [deductMoney, setDeductMoney] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    console.log(storedUsername)

    if (storedUsername !== 'ashu' || storedPassword !== '54321@sHu') {
      window.location.replace('/');
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://98.70.13.241/user/getUser`);
        setTransactions(response.data.data);

        const formattedData = response.data.data.map((transaction) => ({
          id: transaction._id,
          name: transaction.name,
          phone: transaction.phone,
          email: transaction.email,
          wallet: transaction.wallet.toFixed(2),
          withdrawal_amount: Math.abs(transaction.withdrawal_amount).toFixed(2),
          referred_wallet: Math.abs(transaction.referred_wallet).toFixed(2),
          created_at: moment(transaction.createdAt).format('YYYY-MM-DD'),
          referred_users: transaction.refer_id
        }));

        setData(formattedData);

        const tableColumns = [
          { field: 'name', headerName: 'Name', width: 200 },
          { field: 'phone', headerName: 'Phone', width: 220 },
          { field: 'email', headerName: 'Email', width: 220 },
          { field: 'wallet', headerName: 'Wallet', width: 180 },
          { field: 'withdrawal_amount', headerName: 'Withdrawal Amount', width: 220 },
          { field: 'referred_wallet', headerName: 'Referred Wallet', width: 220 },
          { field: 'created_at', headerName: 'Created At', width: 180 },
          { field: 'referred_users', headerName: 'Referred Users', width: 200 },
          {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
              <Button variant="contained" size="small" onClick={() => handleOpenModal(params.row.phone)}>
                Action
              </Button>
            ),
          },
        ];

        setColumns(tableColumns);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const handlePayment = (phone) => {
    navigate(`/history/${phone}`);
  };

  const handleOpenModal = (phone) => {
    setOpenModal(true);
    setPhone(phone);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAddMoney('');
    setDeductMoney('');
  };

  const handleAddMoneyChange = (event) => {
    const value = event.target.value;
    setAddMoney(value !== '' ? parseInt(value, 10) : null);
  };

  const handleDeductMoneyChange = (event) => {
    const value = event.target.value;
    setDeductMoney(value !== '' ? parseInt(value, 10) : null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSubmit = async () => {
    try {
      let apiEndpoint;
      let requestData;

      if (addMoney !== null) {
        apiEndpoint = `${import.meta.env.VITE_REACT_APP_BASE_URL}/wallet/deposit`;
        requestData = {
          phone,
          amount: addMoney,
        };
      } else if (deductMoney !== null) {
        apiEndpoint = `${import.meta.env.VITE_REACT_APP_BASE_URL}/wallet/withdraw`;
        requestData = {
          phone,
          amount: deductMoney,
        };
      } else {
        return;
      }

      const response = await axios.post(apiEndpoint, requestData);
      console.log(response.data);

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'black',
    fontSize: '16px',
    margin: '8px 0',
    display: 'block',
    transition: 'color 0.3s',
    backgroundColor: '#1F2022',
    color: 'white',
  };

  linkStyle[':hover'] = {
    color: '#007bff',
  };

  return (
    <div>
      <header
        style={{
          textAlign: 'center',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          background: '#F1F1F1',
          color: 'black',
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ marginLeft: '6in' }}>
          <h2 style={{ color: 'black' }}>All Users</h2>
        </div>
      </header>

      {/* Drawer component */}

      {/* DataGrid component */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight
        disableSelectionOnClick
      />

      {/* Dialog component */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add/Deduct Money</DialogTitle>
        <DialogContent>
          <TextField
            label="Add Money"
            type="number"
            value={addMoney}
            onChange={handleAddMoneyChange}
          />
          <TextField
            label="Deduct Money"
            type="number"
            value={deductMoney}
            onChange={handleDeductMoneyChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllUsers;
