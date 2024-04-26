async function listar() {
    let resposta = await fetch('/usuarios', {
        method: 'get',
        headers: {
          'Accept': 'application/json'
        }, 
    });
    let usuarios = await resposta.json();
    return usuarios;
}

async function listarEventos() {
    let resposta = await fetch('/eventos', {
        method: 'get',
        headers: {
          'Accept': 'application/json'
        }, 
    });
    let eventos = await resposta.json();
    return eventos;
}

async function adicionar(usuario) {
    let dados = new URLSearchParams(usuario);
    let resposta = await fetch('/usuarios/cadastro', {
        method: 'post',
        headers: {
            'Accept': 'application/json'
          },  
        body: dados
    });

    if (resposta.status == 200) {
        return await resposta.json();
    }
    else {
        throw new Error(await resposta.text()); 
    }
}

async function alterar(usuario) {
    let dados = new URLSearchParams(usuario);
    let resposta = await fetch('/usuarios/cadastro/'+usuario.id, {
        method: 'put',
        headers: {
            'Accept': 'application/json'
          },   
        body: dados
    });
    if (resposta.status == 200) {
        return await resposta.json();
    }
    else {
        throw new Error(await resposta.text()); 
    }
}


async function deletar(id) {
    let resposta = await fetch('/usuarios/' + id, {
        method: 'delete',
        headers: {
            'Accept': 'application/json'
          }, 
    });
    if (resposta.status == 200) {
        return await resposta.json();
    }
    else {
        throw new Error(await resposta.text()); 
    }
}


async function adicionarEventos(evento) {
    let dados = new URLSearchParams(evento);
    let resposta = await fetch('/eventos/cadastro', {
        method: 'post',
        headers: {
            'Accept': 'application/json'
          },  
        body: dados
    });

    if (resposta.status == 200) {
        return await resposta.json();
    }
    else {
        throw new Error(await resposta.text()); 
    }
}

async function alterarEventos(evento) {
    let dados = new URLSearchParams(evento);
    let resposta = await fetch('/eventos/cadastro/'+ evento.id, {
        method: 'put',
        headers: {
            'Accept': 'application/json'
          },   
        body: dados
    });
    if (resposta.status == 200) {
        return await resposta.json();
    }
    else {
        throw new Error(await resposta.text()); 
    }
}


async function deletarEventos(id) {
    let resposta = await fetch('/eventos/' + id, {
        method: 'delete',
        headers: {
            'Accept': 'application/json'
          }, 
    });
    if (resposta.status == 200) {
        return await resposta.json();
    }
    else {
        throw new Error(await resposta.text()); 
    }
}