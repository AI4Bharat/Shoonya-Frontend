import { DropzoneArea } from 'material-ui-dropzone';
export default function App() {
  
  return (
    <div >
     
      <DropzoneArea
      showPreviews={true}
      showPreviewsInDropzone={false}
      useChipsForPreview
      previewGridProps={{container: { spacing: 1, direction: 'row' }}}
      previewText="Selected files"
     
    />
     
      
    </div>

    

   
    
  
  );
}
