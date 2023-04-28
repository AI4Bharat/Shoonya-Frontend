
import { snakeToTitleCase } from "../utils";

const conversationVerificationLabelConfig = (taskData) => {
    console.log(taskData, "taskData");
    const sourceChat = (taskData.unverified_conversation_json)?.map((item, idx) => {
        const speaker = taskData.speakers_json.find(s => s.speaker_id === item.speaker_id);
        return (
            `<View style="display: flex; flex-direction: column; font-weight: 500; gap: 4px; margin: 0 0 8px;">
            <Text name="speaker_${idx}" value="${speaker.name} (${speaker.gender})" />
            ${item.sentences.map((sentence, idx2) => {
                return `<View style="font-weight: normal; font-size: 16px; width: 90%; margin: 0 0 12px; background: #d9d9d9; border-radius: 8px; padding: 4px 10px;">
                <Text name="dialog_${idx}_${idx2}" value="${sentence}" />
            </View>`
            }).join("")}
        </View>`
        )
    }).join("");

    const outputChat = (taskData.unverified_conversation_json)?.map((item, idx) => {
        const speaker = taskData.speakers_json.find(s => s.speaker_id === item.speaker_id);
        return (
            `<View style="display: flex; flex-direction: column; width: 90%; font-weight: 500;">
            <Text name="output_speaker_${idx}" value="${speaker.name} (${speaker.gender})" />
            ${item.sentences.map((sentence, idx2) => {
                const rows = Math.floor(sentence.length / 36) + 1;
                return `
                <TextArea
                name="output_${idx}_${idx2}"
                toName="dialog_${idx}_${idx2}"
                value="${taskData.unverified_conversation_json?.[idx].sentences[idx2] || ""}"
                rows="${rows}"
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
        <View style="display: flex; gap: 4px;" >
            <View style="font-weight: 500;"><Text name="${key}_label" value="${snakeToTitleCase(key)}:" /></View>
            <Text name="${key}" value="${taskData[key]}" />
        </View>`;
    }).join("");

    return `
        <View>
        <Header size="3" value="Metadata"/>
        <View style="font-size: 18px; display: grid; grid-template: auto/1fr 1fr 1fr 1fr; margin-bottom: 15px;">
            ${metadata}
            </View>
            <Header size="3" value="Quality Status"/>,  
            <View>
            <Choices name="quality_status"   toName="quality_status" choice="single-radio" required="true" showInLine="true">
              <Choice alias="Clean" value="Clean" />
              <Choice alias="Corrupt" value="Corrupt" />
            </Choices> 
          </View>  
        <View style="font-size: large; display: grid; grid-template: auto/1fr 1fr; column-gap: 1em;">
            <Header size="3" value="Unverified Conversation"/>
            <Header size="3" value="Verified Conversation"/>
            <View style="display: flex; flex-direction: column; max-height: 75vh; overflow: scroll; overflow-x: hidden;">
            ${sourceChat}
            </View>
            <View style="display: flex; flex-direction: column; max-height: 75vh; overflow: scroll; overflow-x: hidden;">
            ${outputChat}
            </View>
        </View>
        </View>`;
};

export default conversationVerificationLabelConfig;

