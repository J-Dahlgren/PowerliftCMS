export function createFileDownload(data: any, fileName: string) {
  const blob = new Blob([data]);
  const downloadURL = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadURL;
  link.download = fileName;
  link.click();
}
