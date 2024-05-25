import fs from "fs";
import path from "path";
export async function delete_files_from_upload() {
      try {
          // Get the directory path of the currently executing script
          const currentFilePath = new URL(import.meta.url).pathname;
          const currentDirPath = path.dirname(currentFilePath);
          
          // Construct the path to the uploads directory
          const uploadsDir = path.join(currentDirPath, '../uploads');
          
          // Read the files in the uploads directory
          const files = await fs.promises.readdir(uploadsDir);
          
          // Iterate over the files and delete each one
          for (const file of files) {
              const filePath = path.join(uploadsDir, file);
              await fs.promises.unlink(filePath);
          }
          
      } catch (err) {
          console.error('Error deleting files:', err);
      }
  }
