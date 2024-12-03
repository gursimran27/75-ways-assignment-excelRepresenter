import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const App = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [newData, setNewData] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setFile(file)
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const fileData = XLSX.utils.sheet_to_json(firstSheet);
        console.log("A", fileData);
        setData(fileData);
      };
      reader.readAsBinaryString(file);
      event.target.value = null;
  };


  const handleUpload = async () => {
    if (!file) {
        alert('Please select a file');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('File uploaded successfully:', response.data);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

  useEffect(() => {
    if (data) {
      const nd = data.filter((el, index) => index >= 3);
      setNewData(nd);
    }
  }, [data]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          border: "1px solid black",
          justifyContent: "space-evenly",
        }}
      >
        <label>
          Upload File:
          <input type="file" onChange={handleFileChange} />
        </label>
        <button onClick={handleUpload}>Upload</button>
        <div>
          <button
            onClick={() => {
              setData(null);
              setNewData(null);
              setFile(null)
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <br />
      {data && newData && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <table border={1}>
            <thead>
              <tr>
                {Object.values(data[1]).map((el, ind) => {
                  return <th key={ind}>{el}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {newData.map((rowObj, index) => {
                return (
                  <tr key={index}>
                    {Object.values(rowObj).map((el, ind) => {
                      return (
                        <td style={{ textAlign: "center" }} key={ind}>
                          {el}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
