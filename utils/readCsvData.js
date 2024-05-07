import Papa from "papaparse";
import fs from "fs";
export async function read_csv_file (filePath){
      const csvFileContent = fs.readFileSync(filePath, 'utf8');
      // Parse the CSV file content using PapaParse
      const parsedData = Papa.parse(csvFileContent, {
          header: true, // If the first row contains headers
          // Other configuration options as needed
      });
      // Access the parsed data
      return parsedData?.data;
      
}