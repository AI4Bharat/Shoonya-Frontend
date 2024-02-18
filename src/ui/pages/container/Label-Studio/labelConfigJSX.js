export const labelConfigJS = `<View>
<Image name="image_url" value="$image_url"/>
<Labels name="annotation_labels" toName="image_url" className="ignore_assertion">
<Label value="paragraph" name="paragraph" background="green" className="ignore_assertion"/>
<Label value="figure" name="figure" background="yellow" className="ignore_assertion"/>
<Label value="figure-caption" name="figure-caption" background="red" className="ignore_assertion"/>
<Label value="table" name="table" background="cyan" className="ignore_assertion"/>
<Label value="table-caption" name="table-caption" background="brown" className="ignore_assertion"/>
<Label value="footer" name="footer" background="olive" className="ignore_assertion"/>
<Label value="folio" name="folio" background="aqua" className="ignore_assertion"/>
<Label value="footnote" name="footnote" background="maroon" className="ignore_assertion"/>
<Label value="page-number" name="page-number" background="green" className="ignore_assertion"/>
<Label value="author" name="author" background="yellow" className="ignore_assertion"/>
<Label value="dateline" name="dateline" background="red" className="ignore_assertion"/>
<Label value="ordered-list" name="ordered-list" background="cyan" className="ignore_assertion"/>
<Label value="sub-ordered-list" name="sub-ordered-list" background="brown" className="ignore_assertion"/>
<Label value="subsub-ordered-list" name="subsub-ordered-list" background="olive" className="ignore_assertion"/>
<Label value="unordered-list" name="unordered-list" background="aqua" className="ignore_assertion"/>
<Label value="sub-unordered-list" name="sub-unordered-list" background="maroon" className="ignore_assertion"/>
<Label value="subsub-unordered-list" name="subsub-unordered-list" background="green" className="ignore_assertion"/>
<Label value="section-title" name="section-title" background="yellow" className="ignore_assertion"/>
<Label value="sub-section-title" name="sub-section-title" background="red" className="ignore_assertion"/>
<Label value="subsub-section-title" name="subsub-section-title" background="cyan" className="ignore_assertion"/>
<Label value="headline" name="headline" background="brown" className="ignore_assertion"/>
<Label value="sub-headline" name="sub-headline" background="olive" className="ignore_assertion"/>
<Label value="subsub-headline" name="subsub-headline" background="aqua" className="ignore_assertion"/>
<Label value="chapter-title" name="chapter-title" background="maroon" className="ignore_assertion"/>
<Label value="placeholder-text" name="placeholder-text" background="green" className="ignore_assertion"/>
<Label value="formula" name="formula" background="yellow" className="ignore_assertion"/>
<Label value="first-level-question" name="first-level-question" background="red" className="ignore_assertion"/>
<Label value="second-level-question" name="second-level-question" background="cyan" className="ignore_assertion"/>
<Label value="third-level-question" name="third-level-question" background="brown" className="ignore_assertion"/>
<Label value="options" name="options" background="olive" className="ignore_assertion"/>
<Label value="index" name="index" background="aqua" className="ignore_assertion"/>
<Label value="table-of-contents" name="table-of-contents" background="maroon" className="ignore_assertion"/>
<Label value="jumpline" name="jumpline" background="green" className="ignore_assertion"/>
<Label value="advertisement" name="advertisement" background="yellow" className="ignore_assertion"/>
<Label value="sidebar" name="sidebar" background="red" className="ignore_assertion"/>
<Label value="flag" name="flag" background="cyan" className="ignore_assertion"/>
<Label value="reference" name="reference" background="brown" className="ignore_assertion"/>
<Label value="contact-info" name="contact-info" background="olive" className="ignore_assertion"/>
<Label value="website-link" name="website-link" background="aqua" className="ignore_assertion"/>
  
</Labels>

<Rectangle name="annotation_bboxes" toName="image_url" strokeWidth="3" className="ignore_assertion"/>
  
</View>`;