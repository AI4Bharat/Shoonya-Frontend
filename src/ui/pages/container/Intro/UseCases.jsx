// import React from "react";
// import { Link } from "react-router-dom";

// //Styles
// import IntroDatasetStyle from "../../../styles/introDataset";
// import introTheme from "../../../theme/introTheme";

// //Components
// import { Grid, Typography, Button, ThemeProvider } from "@mui/material";
// import Footer from "../../component/Intro/Footer";
// const useCasesData = [
//   {
//     title: "Translation",
//     description: "Allows multiple organizations to be onboarded on single hosted instance.",
//     image: "https://ai4bharat.iitm.ac.in/areas/model/XLIT/IndicXlit", // Replace with actual image URL
//     link:"https://ai4bharat.iitm.ac.in/areas/model/XLIT/IndicXlit"
//   },
//   {
//     title: "Automatic Speach Recognition(ASR)",
//     description: "Supports various AI models like Transliteration, NMT, ASR, TTS, LLMs in many indian languages..",
//     image: "https://ai4bharat.iitm.ac.in/areas/model/ASR/IndicConformer",
//     link:"https://ai4bharat.iitm.ac.in/areas/model/ASR/IndicConformer"
//   },
//   {
//     title: "OCR",
//     description: "Supports various annotations like OCR, Audio transcription, text translation, etc.",
//     image: "https://via.placeholder.com/400",
//     Link:"Coming Soon"
//   },
//   {
//     title: "Conversation",
//     description: "Has clearly-defined user roles with specific permissions.",
//     image: "https://via.placeholder.com/400",
//     Link:"Coming Soon"
//   },

// ];

// const UseCases = () => {
//   const classes = IntroDatasetStyle();

//   const handleClickImg = (link) => {
//     window.open(link);
//   };
//   return (
//     <ThemeProvider theme={introTheme}>
//       <div>
//         <Grid sx={{ mt: 10, mb: 10 }}>
//           <Typography
//             variant="h4"
//             sx={{
//               fontSize: "55px",
//               lineHeight: 1.17,
//               color: "#51504f",
//               marginBottom: "50px",
//             }}
//           >
//             UseCases
//           </Typography>
//         </Grid>



//         {useCasesData.map((useCase, index) => (
//           <Grid
//             key={index}
//             container
//             spacing={4}
//             alignItems="center"
//             justifyContent="center"
//             sx={{
//               flexDirection: index % 2 === 0 ? "row" : "row-reverse",
//               mb: 6,
//               padding: "20px",
//             }}
//           >
//             {/* Image Section */}
//             <Grid item xs={12} md={5}>
//               <div>
//                 <img
//                   src={useCase.image}
//                   alt={useCase.title}
//                   style={{ width: "100%", borderRadius: "10px" }}
//                 />
//               </div>
//             </Grid>

//             {/* Text Section */}
//             <Grid item xs={12} md={5}>
//               <div>
//                 <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
//                   {useCase.title}
//                 </Typography>
//                 <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
//                   {useCase.description}
//                 </Typography>
//                 <Link to="/your-target-page">
//                   <Button variant="contained" color="primary">
//                     Learn More
//                   </Button>
//                 </Link>
//               </div>
//             </Grid>
//           </Grid>
//         ))}

//         <Footer />
//       </div>
//     </ThemeProvider>
//   );
// };

// export default UseCases;


import React from "react";
import { Link } from "react-router-dom";

// Styles
import IntroDatasetStyle from "../../../styles/introDataset";
import introTheme from "../../../theme/introTheme";

// Components
import { Grid, Typography, Button, ThemeProvider } from "@mui/material";
import Footer from "../../component/Intro/Footer";

const useCasesData = [
  {
    title: "Translateration",
    description: "AI4Bharat introduces Aksharantar, the largest Indic transliteration dataset with 26 million pairs across 21 languages and 12 scripts, boosting model accuracy by 15%. The Aksharantar testset offers 103,000 pairs for fine-grained evaluation. For language identification, Bhasha-Abhijnaanam provides a comprehensive LID test set, and IndicLID excels in identifying 47 classes across native and romanized scripts. These resources are publicly available to advance Indic language technology.",
    image: " ",
    link: "https://ai4bharat.iitm.ac.in/areas/xlit",
  },
  {
    title: "Machine Translation",
    description: "AI4Bharat's Samanantar corpus, with 49.7M English-Indic sentence pairs, powers state-of-the-art multilingual NMT models like IndicTrans and IndicTrans2, which supports all 22 Indic languages. The Bharat Parallel Corpus Collection (BPCC) expands resources with 230M bitext pairs, including 2.2M high-quality human-verified pairs. These advancements significantly improve Indic language translation capabilities.",
    image: " ",
    link: "https://ai4bharat.iitm.ac.in/areas/nmt",
  },
  {
    title: "Automatic Speech Recognition (ASR)",
    description: "AI4Bharat's ASR efforts focus on India's linguistic diversity, featuring 300K hours of raw speech, 6K hours of transcriptions, and 6.4K hours of mined data. Robust benchmarks like Vistaar, IndicSUPERB, Lahaja, and Svarah set new ASR evaluation standards. Models like IndicWav2Vec, IndicWhisper, and IndicConformer now support all 22 Indic languages. Future plans include enhancing 8KZ telephony support, domain adaptation, and offline functionality.",
    image: " ",
    link: "https://ai4bharat.iitm.ac.in/areas/asr",
  },
  {
    title: "Speech Synthesis (TTS)",
    description: "AI4Bharat advances TTS for Indian languages with models like FastPitch and HiFi-GAN V1, outperforming existing systems. The Rasa dataset enhances expressiveness for Assamese, Bengali, and Tamil. A cost-effective strategy improves OOV handling in low-resource languages using volunteer-recorded data. Additionally, we restored India's largest multilingual TTS dataset with 1,704 hours of speech from 10,496 speakers across 22 languages.",
    image: " ",
    link: "https://ai4bharat.iitm.ac.in/areas/tts#",
  },
  {
    title: "Large Language Models",
    description: "AI4Bharat builds language models for all 22 Indian languages using large-scale crawling, synthetic data, and human annotation. Our corpus includes 251B tokens and 74.7M prompt-response pairs. Tools like Setu aid data preparation, powering models like Airavata, IndicBART, and IndicBERT, with benchmarks such as FBI, IndicXTREME, and IndicGLUE ensuring quality. Future plans focus on expanding datasets and enhancing generative model diversity.",
    image: "https://via.placeholder.com/400",
    link: "https://ai4bharat.iitm.ac.in/areas/llm", 
  },
  {
    title: "OCR",
    description: "Supports various annotations like OCR, audio transcription, text translation, etc.",
    image: "https://via.placeholder.com/400",
    link: "", // Placeholder for "Coming Soon"
  },
  {
    title: "Conversation",
    description: "Has clearly defined user roles with specific permissions.",
    image: "https://via.placeholder.com/400",
    link: "", // Placeholder for "Coming Soon"
  },
];

const UseCases = () => {
  const classes = IntroDatasetStyle();

  return (
    <ThemeProvider theme={introTheme}>
      <div>
        <Grid sx={{ mt: 10, mb: 10 }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: "55px",
              lineHeight: 1.17,
              color: "#51504f",
              marginBottom: "50px",
            }}
          >
            Use Cases
          </Typography>
        </Grid>

        {useCasesData.map((useCase, index) => (
          <Grid
            key={index}
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
            sx={{
              flexDirection: index % 2 === 0 ? "row" : "row-reverse",
              mb: 6,
              padding: "20px",
            }}
          >
            {/* Image Section */}
            <Grid item xs={12} md={5}>
              <div>
                <img
                  src={useCase.image}
                  alt={useCase.title}
                  style={{ width: "100%", borderRadius: "10px" }}
                />
              </div>
            </Grid>

            {/* Text Section */}
            <Grid item xs={12} md={5}>
              <div>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  {useCase.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mb: 2 ,textAlign: "justify"}}>
                  {useCase.description}
                </Typography>

                {useCase.link ? (
                  <Button
                    variant="contained"
                    color="primary"
                    component="a"
                    href={useCase.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More
                  </Button>
                ) : (
                  <Button variant="contained" color="secondary" disabled>
                    Coming Soon
                  </Button>
                )}
              </div>
            </Grid>
          </Grid>
        ))}

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default UseCases;
