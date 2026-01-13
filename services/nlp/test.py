from transformers import pipeline, BertTokenizer, BertForSequenceClassification

text = '''Te quedaste sin empleo y los siguientes pasos quizás se ven un poco borrosos. Lo primero es entender que perder un empleo no es fácil, no es nada sencillo. Es un remolino de emociones donde no sabemos qué hacer si no teníamos un plan previo y mucho más si se trata de una desvinculación sin previo aviso. Debemos recordar de que no se trata del final de nuestra carrera profesional ni de nosotros como persona. Creo que eso es lo más importante, porque mantener una vista esperanzadora nos hace ver oportunidades que quizás no tendríamos en mente si estuviéramos ocupados dentro de, de un empleo. Y esas nuevas oportunidades pueden verse muy diferentes a las cosas que nosotros hemos estado acostumbrados. 

O sea que esa mentalidad abierta hay que tenerla. Este tiempo hay que aprovecharlo. Hay que aprovecharlo quizás para acercarse a cosas que tú en algún momento te propusiste lograr y quizás te envolviste con la realidad de tu empleo anterior y no pudiste alcanzar. O lograr esas cosas que descubriste dentro de ese empleo que te gustan más que tu propio empleo que perdiste y ahora tienes el tiempo para lograr alcanzarla. Hay cosas importantes que podemos ir dando pequeños pasos, porque la verdad es que, como decía ahorita, se trata de un momento de incertum-- de incertidumbre muy grande, donde quizás si no tenemos pasos muy claros, podemos perdernos y durar mucho en una etapa que en otra. 

Alguna de las cosas más importantes que yo podría decir, y la primordial, es equilibrar nuestras emociones. De esa inteligencia emocional que deberíamos de ir construyendo, este es el momento de ponerla en práctica. Es una situación difícil, como antes decíamos, pero debemos de atravesarla con la mayor fuerza que podamos tener y entender que el mundo no se para, aun así nuestro mundo laboral se haya detenido por unos instantes. Lo segundo, quizás, es tomar el tiempo para replantearnos objetivos profesionales. Ahorita mencionaba algo importante, como es los objetivos profesionales que quizás teníamos al inicio de nuestra carrera, o quizás algunos otros objetivos que se fueron creando a medida de que fuimos avanzando en ellas, o explorar nuevas cosas que quizás no sabemos que tenemos el potencial para hacer, pero en este tiempo que tenemos la disponibilidad que quizás antes no teníamos, podemos desarrollar. Algo importante es mantenernos conectados con las personas que trabajábamos, las de nuestro más reciente trabajo, quizás las anteriores, nuestras amistades y demás. 
'''
 
summarizer = pipeline(
    "text2text-generation",
    model="google/flan-t5-base"
)

classifier = pipeline(
    "text-classification",
    model=BertForSequenceClassification.from_pretrained("./trainingModel/bert-finetuned"),
    tokenizer=BertTokenizer.from_pretrained("./trainingModel/bert-finetuned"),
    truncation=True,
    max_length = 512,
)

def testSummarizer():
    prompt = f"""Resume el texto en un párrafo corto tipo TL;DR: 
    {text}"""

    result = summarizer(
        prompt,
        do_sample=False
    )
    print("SUMMARY:", result[0]["generated_text"])

def testClassifier():
    result = classifier(text)
    print(result)
    print({
        "label": result[0]["label"],
        "confidence": round(result[0]["score"], 3)
    })

testSummarizer()
testClassifier()