export default {
    props: {
        usuarios: Array,
    },
    setup(props, {emit}) {
        const nome = Vue.ref('')        
        const senha = Vue.ref('')
        const papel = Vue.ref('')
        const usuarios = Vue.ref(props.usuarios || [])
        function inserir() {
          usuarios.value.push({
            nome: nome.value,   
            senha: senha.value,
            papel: papel.value
          });
        }
        function selecionar(usuario) {
            emit('selecionado', usuario);
        }
        return {
          nome,
          usuarios,
          senha,
          papel,
          inserir,
          selecionar
        }
    },
    template: `
    <div class="row justify-content-center my-5">
        <div class="col" v-for="usuario of usuarios" :style="{ color: usuario.papel > 2 ? 'red' : 'green' }">
            <article class="card text-center">
                    <p>{{usuario.nome}}</p>
                    <button @click="selecionar(usuario);">Selecionar</button>
            </article>
        </div>
    </div>
    `
}