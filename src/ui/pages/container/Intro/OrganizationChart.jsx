

import React from 'react';
import { Tree } from 'antd';

const orgData = {
  id: "organization",
  name: "🏢 Organization",
  children: [
    {
      id: "workspace",
      name: "📂 Workspace",
      children: [
        {
          id: "workspace_creation",
          name: "🆕 Workspace Creation",
          children: [
            { id: "workspace_details", name: "📋 Enter Workspace Details" },
            { id: "workspace_name", name: "🏷️ Workspace Name" },
            { id: "public_analytics", name: "📊 Public Analytics" },
          ],
        },
        {
          id: "projects",
          name: "📌 Projects",
          children: [
            {
              id: "select_category",
              name: "📂 Select a Category to Work In",
              children: [
                {
                  id: "translation",
                  name: "🌍 Translation",
                  children: [
                    {
                      id: "project_type",
                      name: "📌 Select a Project Type",
                      children: [
                        { id: "monolingual_translation", name: "📄 Monolingual Translation" },
                        { id: "translation_editing", name: "📝 Translation Editing" },
                        { id: "semantic_similarity", name: "🔍 Semantic Textual Similarity (Scale 5)" },
                        { id: "contextual_translation_editing", name: "✏️ Contextual Translation Editing" },
                      ],
                    },
                    { id: "variable_parameter", name: "⚙️ Variable Parameter" },
                    { id: "target_languages", name: "🌍 Target Languages" },
                    {
                      id: "source_target_languages",
                      name: "🔄 Source & Target Languages (Only for Editing Tasks)",
                    },
                    { id: "source_data", name: "🔗 Select Source to Fetch Data From" },
                    {
                      id: "sampling_type",
                      name: "🎯 Select Sampling Type",
                      children: [
                        {
                          id: "random",
                          name: "🎲 Random",
                          children: [
                            { id: "filter_string", name: "🔍 Filter String (int)" },
                            { id: "sampling_percentage", name: "📊 Sampling Percentage" },
                          ],
                        },
                        {
                          id: "full",
                          name: "📂 Full",
                          children: [{ id: "filter_string", name: "🔍 Filter String" }, { id: "annotator_per_task", name: "👥 Annotator per Task" }],
                        },
                        {
                          id: "batch",
                          name: "📦 Batch",
                          children: [
                            { id: "filter_string", name: "🔍 Filter String" },
                            { id: "batch_size", name: "📏 Batch Size" },
                            { id: "batch_number", name: "🔢 Batch Number" },
                            { id: "annotators_per_task", name: "👥 Annotators per Task" },
                          ],
                        },
                      ],
                    },
                    {
                      id: "project_stage",
                      name: "🚦 Project Stage",
                      children: [
                        { id: "annotation", name: "✏️ Annotation Stage" },
                        { id: "review", name: "🔍 Review Stage" },
                        { id: "super_check", name: "✅ Super-Check Stage" },
                      ],
                    },
                    {
                      id: "auto_annotation",
                      name: "⚡ Create Annotation Automatically",
                      children: [
                        { id: "none", name: "🚫 None" },
                        { id: "annotation", name: "✏️ Annotation" },
                        { id: "review", name: "🔍 Review" },
                        { id: "super_check", name: "✅ Super-Check" },
                      ],
                    },
                  ],
                },
                {
                  id: "ocr",
                  name: "🖹 OCR",
                  children: [
                    {
                      id: "project_type",
                      name: "📌 Select a Project Type",
                      children: [
                        { id: "ocr_transcription", name: "📄 OCR Transcription" },
                        { id: "ocr_textline_segmentation", name: "🔍 OCR Textline Segmentation" },
                        { id: "ocr_transcription_editing", name: "✏️ OCR Transcription Editing" },
                        { id: "ocr_segmentation_categorization", name: "📊 OCR Segmentation Categorization" },
                        { id: "ocr_segmentation_categorization_editing", name: "📑 OCR Segmentation Categorization Editing" },
                      ],
                    },
                    { id: "source_data", name: "🔗 Select Source to Fetch Data From" },
                    { id: "sampling_type", name: "🎯 Select Sampling Type" },
                  ],
                },
                {
                  id: "monolingual",
                  name: "📝 Monolingual",
                  children: [
                    {
                      id: "project_type",
                      name: "📌 Select a Project Type",
                      children: [
                        { id: "sentence_splitting", name: "📄 Sentence Splitting" },
                        { id: "contextual_sentence_verification", name: "🔍 Contextual Sentence Verification" },
                        { id: "contextual_verification_domain_classification", name: "📊 Contextual Sentence Verification & Domain Classification" },
                      ],
                    },
                    { id: "target_languages", name: "🌍 Target Languages (for Sentence Splitting)" },
                    { id: "source_data", name: "🔗 Select Source to Fetch Data From" },
                    { id: "sampling_type", name: "🎯 Select Sampling Type" },
                  ],
                },
                {
                  id: "conversation",
                  name: "💬 Conversation",
                  children: [
                    {
                      id: "project_type",
                      name: "📌 Select a Project Type",
                      children: [
                        { id: "conversation_translation_editing", name: "🗣️ Conversation Translation Editing" },
                        { id: "conversation_verification", name: "✔️ Conversation Verification" },
                      ],
                    },
                    { id: "variable_parameter", name: "⚙️ Variable Parameter (Not for Verification)" },
                    { id: "target_languages", name: "🌍 Target Languages" },
                    { id: "source_data", name: "🔗 Select Source to Fetch Data From" },
                    { id: "sampling_type", name: "🎯 Select Sampling Type" },
                  ],
                },
                {
                  id: "audio",
                  name: "🎧 Audio",
                  children: [
                    {
                      id: "project_type",
                      name: "📌 Select a Project Type",
                      children: [
                        { id: "audio_transcription", name: "🎙️ Audio Transcription" },
                        { id: "audio_segmentation", name: "🔊 Audio Segmentation" },
                        { id: "audio_transcription_editing", name: "✏️ Audio Transcription Editing" },
                        { id: "acoustic_normalized_transcription_editing", name: "🎼 Acoustic Normalized Transcription Editing" },
                      ],
                    },
                    { id: "target_languages", name: "🌍 Target Languages" },
                    { id: "source_data", name: "🔗 Select Source to Fetch Data From" },
                    { id: "sampling_type", name: "🎯 Select Sampling Type" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
const generateTreeNodes = (data) => {
  return data.map(item => ({
    title: item.name,
    key: item.id,
    children: item.children ? generateTreeNodes(item.children) : [],
  }));
};

const OrganizationChart = () => {
  const treeData = generateTreeNodes([orgData]);

  return (
    
    <div style={{ margin: '20px' }}>
      <h2 className="text-2xl font-bold text-center mb-4">🚀 Organization Chart</h2>
      <Tree treeData={treeData} />
    </div>
  );
};

export default OrganizationChart;
