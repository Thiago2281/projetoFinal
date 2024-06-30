import { OpenAI } from "langchain/llms/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'



const injest_docs = async(filename) => {
  console.log(filename)
  const loader = new PDFLoader(`uploads/${filename}`); //escolha o nome do pdf.
  const docs = await loader.load();
  console.log('docs loaded')
  
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const docOutput = await textSplitter.splitDocuments(docs)
  let vectorStore = await FaissStore.fromDocuments(
    docOutput,
    new OpenAIEmbeddings(),
    )
    console.log('saving...')

    const directory = "/home/thiago/Desktop/projetoFinal/app"; //altere o diretorio da pasta.
    await vectorStore.save(directory);
    console.log('saved!')

}

// module.exports = injest_docs;
export default injest_docs