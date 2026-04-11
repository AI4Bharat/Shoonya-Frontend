import React from 'react';

export default function OCRSegmentCategorizationPanel({ predictions, selectedL, ocrD, handleSelectChange, setOcrD, ocrDomain }) {
  return (
    <>
      <div style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "#E0E0E0", paddingBottom: "1%", display: "flex", justifyContent: "space-around" }}>
        <div style={{ paddingLeft: "1%", fontSize: "medium", paddingTop: "1%", display: "flex" }}>
          <div style={{ margin: "auto" }}>Languages :&nbsp;</div>
          <select multiple onChange={handleSelectChange} value={selectedL}>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Kannada">Kannada</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Bengali">Bengali</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Assamese">Assamese</option>
            <option value="Bodo">Bodo</option>
            <option value="Dogri">Dogri</option>
            <option value="Kashmiri">Kashmiri</option>
            <option value="Maithili">Maithili</option>
            <option value="Manipuri">Manipuri</option>
            <option value="Nepali">Nepali</option>
            <option value="Odia">Odia</option>
            <option value="Sindhi">Sindhi</option>
            <option value="Sinhala">Sinhala</option>
            <option value="Urdu">Urdu</option>
            <option value="Santali">Santali</option>
            <option value="Sanskrit">Sanskrit</option>
            <option value="Goan Konkani">Goan Konkani</option>
          </select>
        </div>
        <div style={{ paddingLeft: "1%", fontSize: "medium", paddingTop: "1%", display: "flex" }}>
          <div style={{ margin: "auto" }}>Domain :&nbsp;</div>
          <select style={{ margin: "auto" }} onChange={(e) => { setOcrD(e.target.value); ocrDomain.current = e.target.value; }} value={ocrD}>
            <option disabled selected></option>
            <option value="BO">Books</option>
            <option value="FO">Forms</option>
            <option value="OT">Others</option>
            <option value="TB">Textbooks</option>
            <option value="NV">Novels</option>
            <option value="NP">Newspapers</option>
            <option value="MG">Magazines</option>
            <option value="RP">Research_Papers</option>
            <option value="FM">Form</option>
            <option value="BR">Brochure_Posters_Leaflets</option>
            <option value="AR">Acts_Rules</option>
            <option value="PB">Publication</option>
            <option value="NT">Notice</option>
            <option value="SY">Syllabus</option>
            <option value="QP">Question_Papers</option>
            <option value="MN">Manual</option>
          </select>
        </div>
      </div>
      <div style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "#E0E0E0", paddingBottom: "1%" }}>
        <div style={{ paddingLeft: "1%", fontSize: "medium", paddingTop: "1%", paddingBottom: "1%" }}>Predictions</div>
        {predictions?.length > 0 ?
          (() => {
            try {
              return JSON.parse(predictions)?.map((pred, index) => (
                <div style={{ paddingLeft: "2%", display: "flex", paddingRight: "2%", paddingBottom: "1%" }}>
                  <div style={{ padding: "1%", margin: "auto", color: "#9E9E9E" }}>{index}</div>
                  <textarea readOnly style={{ width: "100%", borderColor: "#E0E0E0" }} value={pred.text} />
                </div>
              ));
            } catch (error) {
              console.error("Error parsing predictions:", error);
              return predictions?.map((pred, index) => (
                <div style={{ paddingLeft: "2%", display: "flex", paddingRight: "2%", paddingBottom: "1%" }}>
                  <div style={{ padding: "1%", margin: "auto", color: "#9E9E9E" }}>{index}</div>
                  <textarea readOnly style={{ width: "100%", borderColor: "#E0E0E0" }} value={pred.text} />
                </div>
              ));
            }
          })()
          : <div style={{ textAlign: "center" }}>No Predictions Present</div>}
      </div>
    </>
  );
}