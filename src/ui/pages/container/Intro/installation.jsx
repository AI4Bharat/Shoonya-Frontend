import React, { useState } from "react";
import { Box, Typography, Paper, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Footer from "../../component/Intro/Footer";

// Steps data
const steps = {
    backend: [
        {
            number: 1,
            description: "Clone the Shoonya-Backend repository from GitHub to your local machine.",
            command: "git clone https://github.com/AI4Bharat/Shoonya-Backend.git",
        },
        {
            number: 2,
            description: "Create a virtual environment for the project.",
            command: "python3 -m venv <YOUR-ENVIRONMENT-NAME>",
        },
        {
            number: 3,
            description: "Activate the virtual environment.",
            command: "source <YOUR-ENVIRONMENT-NAME>/bin/activate",
        },
        {
            number: 4,
            description: "Install all required Python packages.",
            command: "pip install -r deploy/requirements-dev.txt",
        },
        {
            number: 5,
            description: "Set up environment variables by copying the example file.",
            command: "cp .env.example ./backend/.env",
        },
        {
            number: 6,
            description: "Open a Python shell.",
            command: "python backend/manage.py shell",
        },
        {
            number: 7,
            description: "Import the utility function to generate a secret key.",
            command: "from django.core.management.utils import get_random_secret_key",
        },
        {
            number: 8,
            description: "Generate and print a new secret key.",
            command: "get_random_secret_key()",
        },
        {
            number: 9,
            description: "Copy the generated key into the .env file as SECRET_KEY.",
            command: "",
        },
    ],
    docker: [
        {
            number: 10,
            description: "Build Docker containers using docker-compose.",
            command: "docker-compose -f docker-compose-local.yml build",
        },
        {
            number: 11,
            description: "Run containers in detached mode.",
            command: "docker-compose -f docker-compose-local.yml up -d",
        },
        {
            number: 12,
            description: "Check pending migrations.",
            command: "docker-compose exec web python backend/manage.py makemigrations",
        },
        {
            number: 13,
            description: "Apply pending migrations.",
            command: "docker-compose exec web python backend/manage.py migrate",
        },
        {
            number: 14,
            description: "Create a Django superuser.",
            command: "docker-compose exec web python backend/manage.py createsuperuser",
        },
        {
            number: 15,
            description: "Run the Django development server.",
            command: "docker-compose exec web python backend/manage.py runserver",
        },
    ],
    frontend: [
        {
            number: 16,
            description: "Clone the Shoonya-Frontend repository.",
            command: "git clone https://github.com/AI4Bharat/Shoonya-Frontend.git",
        },
        {
            number: 17,
            description: "Change directory to the cloned folder.",
            command: "cd Shoonya-Frontend",
        },
        {
            number: 18,
            description: "Install project dependencies with force flag.",
            command: "npm i --force",
        },
        {
            number: 19,
            description: "Start the frontend development server.",
            command: "npm start",
        },
    ],
};

const InstallationGuide = () => {
    const [selectedSection, setSelectedSection] = useState("backend"); // Default section

    const handleRadioChange = (event) => {
        setSelectedSection(event.target.value);
    };

    const handleCopy = (text) => {
        if (text) {
            navigator.clipboard.writeText(text);
        }
    };

    return (
    <Box sx={{ maxWidth: "100%", margin: "auto", padding: "20px",mt: 11 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2,fontSize: "30px", lineHeight: 1.17, color: "#3a3a3a", textAlign: "center" }}>
        Installation Guide
      </Typography>

      {/* Radio Buttons for selecting section */}
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend">Select Installation Section</FormLabel>
        <RadioGroup
          row
          value={selectedSection}
          onChange={handleRadioChange}
        >
          <FormControlLabel value="backend" control={<Radio />} label="Backend" />
          <FormControlLabel value="docker" control={<Radio />} label="Docker" />
          <FormControlLabel value="frontend" control={<Radio />} label="Frontend" />
        </RadioGroup>
      </FormControl>

      {/* Render steps based on selected section */}
      {steps[selectedSection].map((step, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            borderLeft: "5px solid #1976D2",
            padding: "15px",
            marginBottom: "10px",
            backgroundColor: "#F4F6F8",
            borderRadius: "8px",
            maxWidth: "800px",
            margin: "auto",
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "#333" }}>
            Step {step.number}: {step.description}
          </Typography>
          {step.command && (
            <Paper
              elevation={1}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#FFF",
                borderRadius: "5px",
                fontFamily: "monospace",
                fontSize: "14px",
              }}
            >
              <span>{step.command}</span>
              <Button onClick={() => handleCopy(step.command)} sx={{ minWidth: "30px" }}>
                <ContentCopyIcon fontSize="small" />
              </Button>
            </Paper>
          )}
        </Paper>
      ))}
<Footer />
    </Box>
    );
};

export default InstallationGuide;
