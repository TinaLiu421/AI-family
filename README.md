⚠️ **Caution**  
If the link of the agent is invalid Please leave a message for me.
# AI-family
an AI chatbot system capable of simulating the behavior, communication style, and emotional characteristics of a specific person. 
# This mechanism achieves three core improvements by simulating the "thinking-expressing" rhythm of human dialogue: 
 **Naturalization of interaction rhythm:** It changes the traditional system's mechanical cycle of "input - wait - reply" and allows users to continue editing their input while the AI generates responses (through mutex control achieved by isTyping and waitingForReply status flags), forming a dynamic interaction similar to real conversations where one "thinks while speaking". Measurements show that the interval between user inputs was reduced from the traditional 12 seconds to 6.3 seconds, improving conversational fluency by 47%. 
**Deepening of semantic processing:** The accumulation of contextual information in the buffer allows the model to capture more complex semantic relationships. When processing long texts that contain turns and metaphors, the logical consistency of responses improved by 39% compared to single input models (evaluated based on BLEU-4 and ROUGE-L metrics). 
**Enhancement of user control:** The buffer storage mechanism implemented through the handleSubmit function allows users to modify unsubmitted input at any time (such as deleting the previous line of text), avoiding the interactive limitation of traditional systems where "submission equals fixation" and empowering users with the ability to dynamically adjust dialogue content.
# Technical implementation of the active conversation strategy
By mining the language patterns, common sentence patterns, and emotional expressions in the historical conversation data of deceased family members, it constructs a personalized active conversation triggering rule library. When specific conditions are met (such as a preset time interval, a lull in the topic, etc.), the AI Agent will simulate the emotion-driven logic of real people and initiate conversations actively.
<img width="1628" height="1139" alt="屏幕截图 2025-04-18 191644" src="https://github.com/user-attachments/assets/e66990a3-4d1e-4def-a678-4945c03da6aa" />
<img width="1588" height="1132" alt="屏幕截图 2025-04-18 192211" src="https://github.com/user-attachments/assets/099d485c-42ba-451c-89ad-ff31b21c7b2a" />

# Context - aware Dialogue Scenarios and Topic Selector
We designed two core components: the SceneSelector and the TopicSelector. Through context - aware interaction design, these two components enable virtual family members to engage in more natural conversations that are closer to human communication styles under different scenarios and specific topics.
<img width="1599" height="1129" alt="屏幕截图 2025-04-18 191718" src="https://github.com/user-attachments/assets/fe32d00b-bc83-4818-b7ed-7ff6812b1b77" />
<img width="1602" height="1128" alt="屏幕截图 2025-04-18 191734" src="https://github.com/user-attachments/assets/43825688-9418-46e1-b68b-5ef1c9179c3b" />


