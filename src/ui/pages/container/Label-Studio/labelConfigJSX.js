export const labelConfigJS = `<View>
<Image name="image_url" value="$image_url"/>
<Labels name="annotation_labels" toName="image_url" className="ignore_assertion">
  <Label value="title/h1" background="green" name="title/h1" className="ignore_assertion"/>
  <Label value="title/h2" background="green" name="title/h2" className="ignore_assertion"/>
  <Label value="title/h3" background="green" name="title/h3" className="ignore_assertion"/>
  <Label value="text/paragraph" background="blue" name="text/paragraph" className="ignore_assertion"/>
  <Label value="text/foreign-language-text" background="blue" name="text/foreign-language-text" className="ignore_assertion"/>
  <Label value="image/img" background="red" name="image/img" className="ignore_assertion"/>
  <Label value="image/logo" background="red" name="image/logo" className="ignore_assertion"/>
  <Label value="image/formula" background="red" name="image/formula" className="ignore_assertion"/>
  <Label value="image/equation" background="red" name="image/equation" className="ignore_assertion"/>
  <Label value="image/bg-img" background="red" name="image/bg-img" className="ignore_assertion"/>
  <Label value="unord-list" background="yellow" name="unord-list" className="ignore_assertion"/>
  <Label value="ord-list" background="black" name="ord-list" className="ignore_assertion"/>
  <Label value="placeholder/txt" background="orange" name="placeholder/txt" className="ignore_assertion"/>
  <Label value="placeholder/img" background="orange" name="placeholder/img" className="ignore_assertion"/>
  <Label value="table" background="violet" name="table" className="ignore_assertion"/>
  <Label value="dateline" background="cyan" name="dateline" className="ignore_assertion"/>
  <Label value="byline" background="brown" name="byline" className="ignore_assertion"/>
  <Label value="page-number" background="purple" name="page-number" className="ignore_assertion"/>
  <Label value="footer" background="indigo" name="footer" className="ignore_assertion"/>
  <Label value="footnote" background="pink" name="footnote" className="ignore_assertion"/>
  <Label value="header" background="olive" name="header" className="ignore_assertion"/>
  <Label value="social-media-handle" background="aqua" name="social-media-handle" className="ignore_assertion"/>
  <Label value="website-link" background="teal" name="website-link" className="ignore_assertion"/>
  <Label value="caption/fig" background="maroon" name="caption/fig" className="ignore_assertion"/>
  <Label value="caption/table" background="maroon" name="caption/img" className="ignore_assertion"/>
  <Label value="table-header" background="aquamarine" name="table-header" className="ignore_assertion"/>
  
</Labels>

<Rectangle name="annotation_bboxes" toName="image_url" strokeWidth="3" className="ignore_assertion"/>
  
</View>`;