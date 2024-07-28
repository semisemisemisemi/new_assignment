import fs from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// .env 파일을 읽어 환경 변수를 설정합니다.
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('API key not found');
}

const openai = new OpenAI(apiKey);

async function analyzeCode() {
  // 문제 파일과 학생이 작성한 코드 파일 읽기
  const problemStatement = fs.readFileSync('problem.txt', 'utf8');
  const studentCode = fs.readFileSync('student_code.py', 'utf8');  // 파일 경로는 실제 위치로 지정해야 합니다.
  
  const prompt = `
  다음은 학생에게 주어진 문제와 학생이 작성한 코드입니다. 코드를 리뷰하고 잘못된 부분을 지적하며, 어떻게 고치면 좋을지와 그 이유를 설명해 주세요. 또한, 코드의 개선점을 제안해 주세요.

  [문제]
  ${problemStatement}

  [학생이 작성한 코드]
  ${studentCode}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a highly experienced software engineer and provide a thorough code review." },
      { role: "user", content: prompt }
    ]
  });

  const feedback = response.choices[0].message.content.trim();
  fs.writeFileSync('feedback.log', feedback);
}

analyzeCode().catch(error => {
  console.error(error);
  process.exit(1);
});
