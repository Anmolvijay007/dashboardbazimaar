import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Drawer,
  IconButton,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import MenuIcon from '@mui/icons-material/Menu';
import {Link, useNavigate} from 'react-router-dom'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
const LastUsers = () => {
  const [transactions, setTransactions] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [open,setOpen]=useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [data,setData]=useState([]);
  const [columns,setColumn]=useState([]);
  const[activeColumn,setActiveColumn]=useState('')
  const handleColumnHeaderClick = (column) => {
    setActiveColumn(column.field === activeColumn ? null : column.field);
  };
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter based on user ID, name, phone, email, or any other relevant fields
    return (
      transaction._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const filterTransactionsLast7Days = (transactions) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
    return transactions.filter((transaction) => new Date(transaction.createdAt) >= sevenDaysAgo);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://98.70.13.241/user/getUser`);
        console.log(`>>>>>>>>>>>${JSON.stringify(response)}`)
        setTransactions(response.data.data);
        const finData=filterTransactionsLast7Days(response.data.data)
        const data = finData.map((transaction) => ({
          key: transaction._id,
          name: transaction.name,
          phone: transaction.phone,
          email: transaction.email,
          wallet: transaction.wallet.toFixed(2),
          withdrawal_amount:Math.abs(transaction.withdrwarl_amount).toFixed(2),
          referred_wallet:Math.abs(transaction.referred_wallet).toFixed(2)
        }));
        setData(data)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>`,data)
        const columns=[
          {
            "field":"name",
            "headerName":"Name",
            width:250,
            cellClassName:'property'
          },
          {
            "field":"phone",
            "headerName":"Phone",
            width:250,
            cellClassName:'property'
          },
          
          {
            "field":"email",
            "headerName":"Email",
            width:250,
            cellClassName:'property'
          },
          {
            "field":"wallet",
            "headerName":"Wallet",
            width:250,
            cellClassName:'property'
          },
          
          {
            "field":"withdrawal_amount",
            "headerName":"Withdrawal Amount",
            width:250,
            cellClassName:'property'
          },{
            "field":"referred_wallet",
            "headerName":"Referred Wallet",
            width:250,
            cellClassName:'property'
          },
          ,
  {
    field: 'transactionsButton',
    headerName: 'Transactions',
    width: 150,
    renderCell: (params) => (
      <TableCell>
        <Button
          variant="contained"
          size="small"
          onClick={() => handlePayment(params.row.phone)}
        >
          Transactions
        </Button>
      </TableCell>
    ),
  },
  {
    field: 'betButton',
    headerName: 'Bet',
    width: 150,
    renderCell: (params) => (
      <TableCell>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleBet(params.row.phone)}
        >
          Bet
        </Button>
      </TableCell>
    ),
  }
          
      ]
      setColumn(columns)
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const navigate=useNavigate()
  const handlePayment = (phone) => {
    const mobileNumber = phone;  // Replace this with your actual mobile number
  
    // Navigate to the HistoryPage with the mobile number as a query parameter
    navigate(`/history/${phone}`)
  };
  const handleBet=(phone)=>{
    navigate(`/bet/${phone}`)
  }
  
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const linkStyle = {
    textDecoration: 'none',
    fontSize: '16px',
    margin: '8px 0',
    display: 'block',
    transition: 'color 0.3s',
    backgroundColor:'#DADADA',
    color:'black'
  };
  const [sortModel, setSortModel] = useState([]);

  const handleSortModelChange = (newModel) => {
    setSortModel(newModel);
  };

  const renderSortIndicator = (field) => {
    const sortedColumn = sortModel.find((column) => column.field === field);
    if (sortedColumn) {
      return sortedColumn.sort === 'asc' ? '↑' : '↓';
    }
    return null;
  };

  const CustomHeaderCell = ({ column }) => (
    <div style={{fontSize:'20px',fontWeight:'bold'}}>
      {column.headerName}
      {renderSortIndicator(column.field)}
    </div>
  );
  
  linkStyle[':hover'] = {
    color: '#007bff',
  };
  

  return (
    <div
      style={{
        // display: 'flex',
        // flexDirection: 'column',
        // minHeight: '100vh',
        // width: 'auto'
      }}
    >
      {/* Header with Sidebar Button */}
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
        <div style={{marginLeft:'6in'}}><h2  style={{ color: 'black' }}>Last 7 Day Users</h2></div>
      </header>
      <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={toggleDrawer(false)}
    >
      <div style={{ width: '300px', padding: '20px', background: '#DADADA' }}>
      {/* Sidebar content goes here */}
        {/* List of links in the drawer */}
        <Link to="/" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Transactions</Link>
        <Link to="/pending" onClick={() => setDrawerOpen(false)} style={linkStyle}>Pending Withdrawal Requests</Link>
        <Link to="/approved" onClick={() => setDrawerOpen(false)} style={linkStyle}>Approved Transactions</Link>
        <Link to="/users" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Users</Link>
        <Link to="/lastUsers" onClick={() => setDrawerOpen(false)} style={linkStyle}>Last 7 days Users</Link>
        <Link to="/Stats" onClick={() => setDrawerOpen(false)} style={linkStyle}>Stats</Link>
        </div>
    </Drawer>
      {/* <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ margin: '10px' }}
      /> */}
      

      {/* Main Content */}
      {/* <main > */}
      <DataGrid
        rows={data}
        columns={columns.map((column) => ({
          ...column,
          headerName: (
            <CustomHeaderCell column={column} />
          ),
        }))}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        components={{
          ColumnHeaderCell: ({ column }) => (
            <div onClick={() => handleColumnHeaderClick(column)}>
              {column.headerName}
              {renderSortIndicator(column.field)}
            </div>
          ),
        }}
        getRowId={(row) => row.key}
        pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 10,
          bottom: params.isLastVisible ? 0 : 10,
        })}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        sx={{
          '&.MuiDataGrid-root': {
            bgcolor: '#DADADA',
            color: 'black',
            borderColor: 'transparent',
          },
          '&.MuiDataGrid-filterIcon': {
            bgcolor: '#DADADA',
            color: 'white',
            borderColor: 'transparent',
          },
          '& .MuiDataGrid-cell, & .MuiDataGrid-colCellTitle': {
            background:'#DADADA'
          },
          '.css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar': {
            color: 'black'
            /* Add any other styles you want to apply */
          }
        }}/>
      <footer
        style={{
          backgroundColor: '#1F2022',
          color: 'white',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <p>&copy; 2024 baazi Maar</p>
      </footer>
    </div>
  );
};

export default LastUsers;
