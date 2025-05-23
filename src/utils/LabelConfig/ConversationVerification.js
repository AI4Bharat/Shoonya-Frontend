import { snakeToTitleCase } from "../utils";

const conversationVerificationLabelConfig = (taskData) => {
    const sourceChat = (taskData.unverified_conversation_json)?.map((item, idx) => {
        const speaker = taskData?.speakers_json.find(s => s?.speaker_id == item?.speaker_id);
        return (
            `<View style="display: flex; flex-direction: column; font-weight: 500; gap: 0.25rem; margin: 0 0 0.5rem;">
            <Text name="speaker_${idx}" value="${speaker?.name} (${speaker?.gender})" />
            ${item?.sentences.map((sentence, idx2) => {
                return `<View style="font-weight: normal; font-size: 1rem; width: 100%; margin: 0 0 0.75rem; background: #d9d9d9; border-radius: 0.5rem; padding: 0.25rem 0.625rem;">
                <Text name="dialog_${idx}_${idx2}" value="${sentence}" />
            </View>`
            }).join("")}
        </View>`
        )
    }).join("");

    const outputChat = (taskData?.unverified_conversation_json)?.map((item, idx) => {
        const speaker = taskData?.speakers_json.find(s => s?.speaker_id == item?.speaker_id);
        return (
            `<View style="display: flex; flex-direction: column; width: 100%; font-weight: 500;">
            <Text name="output_speaker_${idx}" value="${speaker?.name} (${speaker?.gender})" />
            ${item.sentences.map((sentence, idx2) => {
                const rows = Math.floor(sentence.length / 36) + 1;
                return `
                <TextArea
                name="output_${idx}_${idx2}"
                toName="dialog_${idx}_${idx2}"
                value="${taskData.unverified_conversation_json?.[idx].sentences[idx2] || ""}"
                rows="${rows > 1 ? rows : 2}"
                transcription="true"
                maxSubmissions="1"
                showSubmitButton="false"
                editable="false"
                required="true"
                />`
            }
            ).join("")}
        </View>`
        )
    }).join("");

    const metadata = Object.keys(taskData).map((key) => {
        if (["unverified_conversation_json", "speakers_json"].includes(key) || !taskData[key]) return "";
        return `
        <View style="display: flex; flex-direction: column; gap: 0.25rem; padding: 0.75rem; background: #f8f9fa; border-radius: 0.5rem; flex: 0 1 250px; min-width: 200px; margin: 0.125rem;">
            <View style="font-weight: 500; font-size: 0.875rem; color: #495057;"><Text name="${key}_label" value="${snakeToTitleCase(key)}:" /></View>
            <Text name="${key}" value="${taskData[key]}" style="font-size: 0.875rem; word-break: break-word; color: #212529;"/>
        </View>`;
    }).join("");

    return `
        <View>
          <Header size="3" value="Metadata" style="margin-bottom: 1rem;"/>
          <View style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
            ${metadata}
          </View>

          <Header size="3" value="Quality Status" style="margin-bottom: 1rem;"/>  
          <View style="margin-bottom: 1.5rem;">
            <Choices name="quality_status" toName="quality_status" choice="single-radio" required="true" showInLine="true">
              <Choice alias="Clean" value="Clean" />
              <Choice alias="Corrupt" value="Corrupt" />
            </Choices>
          </View>

          <View style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; padding: 0.5rem 0;">
              <View style="padding: 0.7rem; flex: 1 1 600px; min-width: 250px; max-width: 550px; display: flex; flex-direction: column; max-height: 75vh; overflow: auto; background: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <Header size="3" value="Unverified Conversation" style="margin-bottom: 1rem;"/>
                ${sourceChat}
              </View>
              
              <View style="padding: 0.7rem; flex: 1 1 600px; min-width: 250px; max-width: 550px; display: flex; flex-direction: column; max-height: 75vh; overflow: auto; background: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <Header size="3" value="Verified Conversation" style="margin-bottom: 1rem;"/>
                ${outputChat}
              </View>
          </View>
        </View>`;
};

export default conversationVerificationLabelConfig;