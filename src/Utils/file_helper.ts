
// Read a file and return its content as a string
export function readFile(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    return new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}