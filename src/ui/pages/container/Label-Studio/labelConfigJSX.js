export const labelConfigJS = `<View>
<Image name="image_url" value="$image_url"/>
<Filter name="filter" toName="annotation_labels"
          hotkey="shift+f" minlength="0"
          placeholder="Filter Labels" />
<Labels name="annotation_labels" toName="image_url" className="ignore_assertion">
<Label value="paragraph" name="paragraph" background="#55EFC4" className="ignore_assertion"/>
<Label value="figure" name="figure" background="#FFEAA7" className="ignore_assertion"/>
<Label value="figure-caption" name="figure-caption" background="#FDCB6E" className="ignore_assertion"/>
<Label value="table" name="table" background="#FAB1A0" className="ignore_assertion"/>
<Label value="table-caption" name="table-caption" background="#E17055" className="ignore_assertion"/>
<Label value="footer" name="footer" background="#81ECEC" className="ignore_assertion"/>
<Label value="folio" name="folio" background="#74B9FF" className="ignore_assertion"/>
<Label value="footnote" name="footnote" background="#A29BFE" className="ignore_assertion"/>
<Label value="page-number" name="page-number" background="#A0BCC2" className="ignore_assertion"/>
<Label value="author" name="author" background="#E5E3C9" className="ignore_assertion"/>
<Label value="dateline" name="dateline" background="#E7FBBE" className="ignore_assertion"/>
<Label value="ordered-list" name="ordered-list" background="#F9F7C9" className="ignore_assertion"/>
<Label value="sub-ordered-list" name="sub-ordered-list" background="#D5F0C1" className="ignore_assertion"/>
<Label value="subsub-ordered-list" name="subsub-ordered-list" background="#AAD9BB" className="ignore_assertion"/>
<Label value="unordered-list" name="unordered-list" background="#FFE5E5" className="ignore_assertion"/>
<Label value="sub-unordered-list" name="sub-unordered-list" background="#E0AED0" className="ignore_assertion"/>
<Label value="subsub-unordered-list" name="subsub-unordered-list" background="#AC87C5" className="ignore_assertion"/>
<Label value="section-title" name="section-title" background="#F7FFE5" className="ignore_assertion"/>
<Label value="sub-section-title" name="sub-section-title" background="#E1ECC8" className="ignore_assertion"/>
<Label value="subsub-section-title" name="subsub-section-title" background="#C4D7B2" className="ignore_assertion"/>
<Label value="headline" name="headline" background="#F5EBEB" className="ignore_assertion"/>
<Label value="sub-headline" name="sub-headline" background="#E4D0D0" className="ignore_assertion"/>
<Label value="subsub-headline" name="subsub-headline" background="#D5B4B4" className="ignore_assertion"/>
<Label value="chapter-title" name="chapter-title" background="#F7C8E0" className="ignore_assertion"/>
<Label value="placeholder-text" name="placeholder-text" background="#EEF1FF" className="ignore_assertion"/>
<Label value="formula" name="formula" background="#CDF0EA" className="ignore_assertion"/>
<Label value="first-level-question" name="first-level-question" background="#FFE3E1" className="ignore_assertion"/>
<Label value="second-level-question" name="second-level-question" background="#FFD1D1" className="ignore_assertion"/>
<Label value="third-level-question" name="third-level-question" background="#FF9494" className="ignore_assertion"/>
<Label value="options" name="options" background="#E8DFCA" className="ignore_assertion"/>
<Label value="index" name="index" background="#FFCCB3" className="ignore_assertion"/>
<Label value="table-of-contents" name="table-of-contents" background="#9ED2C6" className="ignore_assertion"/>
<Label value="jumpline" name="jumpline" background="#F5E8C7" className="ignore_assertion"/>
<Label value="advertisement" name="advertisement" background="#ECCCB2" className="ignore_assertion"/>
<Label value="sidebar" name="sidebar" background="#FFDBA4" className="ignore_assertion"/>
<Label value="flag" name="flag" background="#C4DFAA" className="ignore_assertion"/>
<Label value="reference" name="reference" background="#F2D7D9" className="ignore_assertion"/>
<Label value="contact-info" name="contact-info" background="#DAEAF1" className="ignore_assertion"/>
<Label value="website-link" name="website-link" background="#8CC0DE" className="ignore_assertion"/>
</Labels>
<Rectangle name="annotation_bboxes" toName="image_url" strokeWidth="3" className="ignore_assertion"/>
<Relations>
    <Relation value="continues-to" selected="true"/>
</Relations>
</View>`;
