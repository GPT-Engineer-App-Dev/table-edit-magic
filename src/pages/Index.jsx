import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Papa from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data;
          setHeaders(data[0]);
          setCsvData(data.slice(1));
        },
        error: (error) => {
          toast.error("Failed to parse CSV file");
        },
      });
    }
  };

  const handleAddRow = () => {
    setCsvData([...csvData, Array(headers.length).fill("")]);
  };

  const handleRemoveSelectedRows = () => {
    const newData = csvData.filter((row, index) => !row.selected);
    setCsvData(newData);
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse([headers, ...csvData.map(row => row.slice(0, -1))]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (event, rowIndex, colIndex) => {
    const newData = [...csvData];
    newData[rowIndex][colIndex] = event.target.value;
    setCsvData(newData);
  };

  const handleCheckboxChange = (event, rowIndex) => {
    const newData = [...csvData];
    newData[rowIndex].selected = event.target.checked;
    setCsvData(newData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Upload and Edit Tool</h1>
      <Card className="mb-4 p-4">
        <Label htmlFor="csvUpload">Upload CSV File</Label>
        <Input type="file" id="csvUpload" accept=".csv" onChange={handleFileUpload} />
        <Button onClick={handleFileUpload} className="mt-2">Upload</Button>
      </Card>
      {csvData.length > 0 && (
        <>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    <Input type="checkbox" onChange={(e) => handleCheckboxChange(e, rowIndex)} />
                  </TableCell>
                  {row.map((cell, colIndex) => (
                    <TableCell key={colIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex space-x-2">
            <Button onClick={handleAddRow}>Add Row</Button>
            <Button onClick={handleRemoveSelectedRows}>Remove Selected Rows</Button>
            <Button onClick={handleDownloadCSV}>Download CSV</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;