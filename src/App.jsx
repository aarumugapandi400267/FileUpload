import { useState } from 'react';
import { Button, Container, Typography, Select, MenuItem, InputLabel, FormControl, Snackbar, LinearProgress } from '@mui/material';
import axios from 'axios';
import './App.css';

const FileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [collection, setCollection] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openSnackbarError, setOpenSnackbarError] = useState(false)
  const [loading, setLoading] = useState(false)



  const handleFileUpload = async (event) => {
    setLoading(true)
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('fileUpload', file);
      formData.append('collection', collection);

      const response = await axios.post('http://localhost:3002/upload-excel', formData);
      // console.log(response)
      setLoading(false)
      if (response.data.status === "Ok") {
        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
        }, 3000);
      } else if (response.data.message) {
        setOpenSnackbarError(true)
      }

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  return (
    <>
      <Container style={{ backgroundColor: "#1b4552", color: "#eaeaea", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", textAlign: "center", gap: "4em" }}>
        {loading && <LinearProgress />}
        <br />
        <Typography style={{ color: "white" }} variant="h5" component="h2" gutterBottom>
          Upload a File
        </Typography>
        <form onSubmit={handleFileUpload}>
          <FormControl variant='filled' fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel style={{ color: "white" }} id="demo-simple-select-label">Select type of Collection</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="collection"
              value={collection}
              label="Select type of Collection"
              onChange={(e) => setCollection(e.target.value)}
              style={{ color: "white", border: "10px", borderColor: "white" }}
            >
              <MenuItem value="Absent">Absent</MenuItem>
              <MenuItem value="Present">Present</MenuItem>
              <MenuItem value="Partially_Absent">Partially Absent</MenuItem>
              <MenuItem value="Holiday">Holiday</MenuItem>
              <MenuItem value="Dayscholar_Absent">Dayscholar Absent</MenuItem>
              <MenuItem value="Dayscholar_Present">Dayscholar Present</MenuItem>
            </Select>
          </FormControl>
          <input
            type="file"
            accept=".xlsx"
            name="fileUpload"
            style={{
              color: "white",
              border: "2px solid white",
              backgroundColor: "#333",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              outline: "none",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "border-color 0.3s ease-in-out",
            }}
            onChange={(e) => setFile(e.target.files[0])}
          /><br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!file}
            style={{ marginTop: "20px", backgroundColor: "#d74a49", color: "white" }}
          >
            Upload
          </Button>
        </form>
        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          autoHideDuration={3000}
          message="File Uploaded"
        />
        <Snackbar
          open={openSnackbarError}
          onClose={() => setOpenSnackbarError(false)}
          autoHideDuration={3000}
          message="File Name Doesn't Match Please Check "
        />
      </Container>
    </>
  );
};

export default FileUploadForm;
