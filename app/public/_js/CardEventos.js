export default {
    props: {
        eventos: Array,
    },
    setup(props, {emit}) {
        const nome = Vue.ref('')        
        const lado = Vue.ref('')
        const area = Vue.ref('')
        const eventos = Vue.ref(props.eventos || [])
        function inserir() {
          eventos.value.push({
            nome: nome.value,     
            lado: lado.value,
            area: area.value
          });
        }
        function selecionar(evento) {
            emit('selecionado', evento);
        }
        return {
          nome,
          eventos,
          lado,
          area,
          inserir,
          selecionar
        }
    },
    template: `
    <div class="row justify-content-center my-5">
        <div class="col" v-for="evento of eventos" :style="{ color: evento.area > 50 ? 'red' : 'green' }">
            <article class="card text-center">
                    <p>{{evento.nome}}</p>
                    <button @click="selecionar(evento);">Selecionar</button>
            </article>
        </div>
    </div>
    `
}