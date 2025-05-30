export const labelConfigJS = `<View>
<Image name="image_url" value="$image_url" maxWidth="900px"/>
<Filter name="filter" toName="annotation_labels"
          hotkey="shift+f" minlength="0"
          placeholder="Filter Labels" />
<Labels name="annotation_labels" toName="image_url" className="ignore_assertion">
<Label value="advertisement" name="advertisement" background="#1ABC9C" className="ignore_assertion"/>
<Label value="answer" name="answer" background="#2980B9" className="ignore_assertion"/>
<Label value="author" name="author" background="#2980B9" className="ignore_assertion"/>
<Label value="chapter-title" name="chapter-title" background="#F7C8E0" className="ignore_assertion"/>
<Label value="contact-info" name="contact-info" background="#D35400" className="ignore_assertion"/>
<Label value="dateline" name="dateline" background="#16A085" className="ignore_assertion"/>
<Label value="figure" name="figure" background="#8E44AD" className="ignore_assertion"/>
<Label value="figure-caption" name="figure-caption" background="#FDCB6E" className="ignore_assertion"/>
<Label value="first-level-question" name="first-level-question" background="#E74C3C" className="ignore_assertion"/>
<Label value="flag" name="flag" background="#34495E" className="ignore_assertion"/>
<Label value="folio" name="folio" background="#74B9FF" className="ignore_assertion"/>
<Label value="footer" name="footer" background="#81ECEC" className="ignore_assertion"/>
<Label value="footnote" name="footnote" background="#A29BFE" className="ignore_assertion"/>
<Label value="formula" name="formula" background="#2ECC71" className="ignore_assertion"/>
<Label value="header" name="header" background="#8CC0DE" className="ignore_assertion"/>
<Label value="headline" name="headline" background="#D35400" className="ignore_assertion"/>
<Label value="index" name="index" background="#FFCCB3" className="ignore_assertion"/>
<Label value="jumpline" name="jumpline" background="#F39C12" className="ignore_assertion"/>
<Label value="options" name="options" background="#E8DFCA" className="ignore_assertion"/>
<Label value="ordered-list" name="ordered-list" background="#2C3E50" className="ignore_assertion"/>
<Label value="page-number" name="page-number" background="#A0BCC2" className="ignore_assertion"/>
<Label value="paragraph" name="paragraph" background="#55EFC4" className="ignore_assertion"/>
<Label value="placeholder-text" name="placeholder-text" background="#3498DB" className="ignore_assertion"/>
<Label value="quote" name="quote" background="#8CC0DE" className="ignore_assertion"/>
<Label value="reference" name="reference" background="#27AE60" className="ignore_assertion"/>
<Label value="second-level-question" name="second-level-question" background="#9B59B6" className="ignore_assertion"/>
<Label value="section-title" name="section-title" background="#F39C12" className="ignore_assertion"/>
<Label value="sidebar" name="sidebar" background="#F1C40F" className="ignore_assertion"/>
<Label value="sub-headline" name="sub-headline" background="#8E44AD" className="ignore_assertion"/>
<Label value="sub-ordered-list" name="sub-ordered-list" background="#E67E22" className="ignore_assertion"/>
<Label value="sub-section-title" name="sub-section-title" background="#C0392B" className="ignore_assertion"/>
<Label value="subsub-ordered-list" name="subsub-ordered-list" background="#AAD9BB" className="ignore_assertion"/>
<Label value="subsub-section-title" name="subsub-section-title" background="#27AE60" className="ignore_assertion"/>
<Label value="sub-unordered-list" name="sub-unordered-list" background="#E0AED0" className="ignore_assertion"/>
<Label value="subsub-headline" name="subsub-headline" background="#D5B4B4" className="ignore_assertion"/>
<Label value="subsub-unordered-list" name="subsub-unordered-list" background="#AC87C5" className="ignore_assertion"/>
<Label value="table" name="table" background="#FAB1A0" className="ignore_assertion"/>
<Label value="table-caption" name="table-caption" background="#E17055" className="ignore_assertion"/>
<Label value="table-of-contents" name="table-of-contents" background="#9ED2C6" className="ignore_assertion"/>
<Label value="third-level-question" name="third-level-question" background="#FF9494" className="ignore_assertion"/>
<Label value="unordered-list" name="unordered-list" background="#8E44AD" className="ignore_assertion"/>
<Label value="unsure" name="unsure" background="#D35400" className="ignore_assertion"/>
<Label value="website-link" name="website-link" background="#8CC0DE" className="ignore_assertion"/>

</Labels>
<Rectangle name="annotation_bboxes" toName="image_url" strokeWidth="3" className="ignore_assertion"/>
<Relations>
    <Relation value="c" selected="true"/>
</Relations>
</View>`;

export function addLabelsToBboxes(data) {
    const bboxIdToLabel = new Map();
    data.forEach(item => {
        if (item.type === "labels" && item.value.labels) {
            const bboxId = item.id;
            bboxIdToLabel.set(bboxId, item.value.labels[0]);
        }
    });

    data.forEach(item => {
        if (item.type === "rectangle" && !bboxIdToLabel.has(item.id)) {
            const labelItem = {
                original_width: item.original_width,
                original_height: item.original_height,
                image_rotation: item.image_rotation,
                value: {
                    x: item.value.x,
                    y: item.value.y,
                    width: item.value.width,
                    height: item.value.height,
                    rotation: item.value.rotation,
                    labels: ["Body"]
                },
                id: item.id,
                from_name: "annotation_labels",
                to_name: "image_url",
                type: "labels",
                origin: "manual"
            };
            data.push(labelItem);
            bboxIdToLabel.set(item.id, "Body");
        }
    });

    return data;
}