export default {
    props: {
        usuarios: Array,
    },
    setup(props, {emit}) {
        // const nome = Vue.ref(props.nome2)        
        const autor = Vue.ref('')
        const preco = Vue.ref('')
        const usuarios = Vue.ref(props.usuarios || [])
        function inserir() {
          usuarios.value.push({
            nome: nome.value,   
            autor: autor.value,
            preco: preco.value
          });
        }
        function selecionar(usuario) {
            emit('selecionado', usuario);
        }
        return {
          nome,
          usuarios,
          autor,
          preco,
          inserir,
          selecionar
        }
    },
    template: `
    <div class="row justify-content-center my-5">
        <div class="col" v-for="usuario of usuarios" :style="{ color: usuario.preco > 50 ? 'red' : 'green' }">
            <article class="card text-center">
                    <p>{{usuario.nome}}</p>
                    <button @click="selecionar(usuario);">Selecionar</button>
            </article>
        </div>
    </div>
    `
}