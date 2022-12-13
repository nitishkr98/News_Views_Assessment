import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {
  Card,
  Container,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import ModalDialog from '../ModalDialog';
import styled from '@emotion/styled';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#636e72',
    color: '#fff',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const NewsViews = () => {
  const [searchValue, setSearchValue] = useState('');
  const [tableDataLoader, setTableDataLoader] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [webUrl, setWebUrl] = useState('');

  const fetchNews = async (query) => {
    try {
      setTableDataLoader(true);
      let endpoint = `https://content.guardianapis.com/search?api-key=${process.env.REACT_APP_GUARDIAN_API_KEY}`;
      if (query) {
        endpoint += `&q=${query}`;
      }
      const res = await axios.get(endpoint);
      console.log(res.data.response.results);
      const { results } = res.data.response;
      setTableData(results);
      setTableDataLoader(false);
    } catch (error) {
      console.log(error);
      setTableDataLoader(false);
    }
  };

  useEffect(() => {
    // NOTE: I could have added debouncing to improve performance for fetching data on search change, but time was less for that

    fetchNews(searchValue);
  }, [searchValue]);

  const openArticle = (myURL) => {
    let left = (window.innerWidth - 1200) / 2;
    let top = (window.innerHeight - 900) / 4;
    window.open(
      myURL,
      'Article',
      'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
        1200 +
        ', height=' +
        900 +
        ', top=' +
        top +
        ', left=' +
        left
    );
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              News and Views
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth={'xl'}>
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ py: 2.5 }}
        >
          <TextField
            fullWidth
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search..."
          />
        </Stack>
        <Card sx={{ marginBottom: '2rem' }}>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table size={'medium'}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Web Title</StyledTableCell>
                  <StyledTableCell>Section Name</StyledTableCell>
                  <StyledTableCell>Pillar Name</StyledTableCell>
                  <StyledTableCell>Type</StyledTableCell>
                  <StyledTableCell>Publication Date</StyledTableCell>
                </TableRow>
              </TableHead>
              {tableDataLoader ? (
                <TableBody>
                  {Array.from(Array(10), (e, i) => (
                    <TableRow key={`row-${i}`}>
                      {Array.from(Array(5)).map((el, index) => (
                        <TableCell key={`cell-${index}`}>
                          <Skeleton
                            animation="wave"
                            width="98%"
                            height="100%"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  {tableData.length ? (
                    tableData.map((el) => {
                      return (
                        <TableRow key={el.id}>
                          <TableCell
                            style={{ cursor: 'pointer' }}
                            onClick={() => openArticle(el.webUrl)}
                          >
                            {el.webTitle}
                          </TableCell>
                          <TableCell>{el.sectionName}</TableCell>
                          <TableCell>{el.pillarName}</TableCell>
                          <TableCell>{el.type}</TableCell>
                          <TableCell>
                            {new Date(el.webPublicationDate).toLocaleDateString(
                              'en-US',
                              { year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell>No record to show</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Card>

        {/* 
        While trying to open Article in Iframe getting this error => 
          Refused to display 'https://www.theguardian.com/' in a frame because it set 'X-Frame-Options' to 'sameorigin'. 
        
          So I opened it in new window
        */}

        {webUrl && <ModalDialog webUrl={webUrl} setWebUrl={setWebUrl} />}
      </Container>
    </div>
  );
};

export default NewsViews;
