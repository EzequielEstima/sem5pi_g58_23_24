using System.Net;
using System.Net.Http;
using Moq.Protected;

namespace MDTarefasTest.Services;

public class TarefaServiceTest {

    [Fact]
    public async void ensureInvalidTipoTarefaThrowsException() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "invalido";

        async Task ActAsync() => await tarefaService.criarTarefa(criarTarefaDTO, "token");

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tipo de tarefa inválido", exception.Message);
    }


    [Fact]
    public async void ensureMissingVigilanciaParametersThrowsException() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "vigilancia";

        async Task ActAsync() => await tarefaService.criarTarefa(criarTarefaDTO,"token");

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tarefa de vigilância necessita de um contacto (nome e nº de telefone), código de edifício e número de piso", exception.Message);
    }
    [Fact]
    public async void ensureMissingPickUpDeliveryParametersThrowsException() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "PICkUPDELIVERY";

        async Task ActAsync() => await tarefaService.criarTarefa(criarTarefaDTO,"token");

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tarefa de pick up and delivery necessita de um código de confirmação, descrição de entrega, contactos (nome e nº de telefone) de pick up e delivery, sala inicial e sala final", exception.Message);
    }

    [Fact]
    public async void ensureValidPickUpDeliveryIsCreated() {

        var expectedTarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","email@email.com","id",""
        );    

        // To mock the http request, we need to mock the HttpMessageHandler (Client calls MessageHandler)
        var httpHandlerMock = new Mock<HttpMessageHandler>();
        
        var httpResponse = new HttpResponseMessage
                             {
                                 StatusCode = HttpStatusCode.OK,
                                 Content = new StringContent("[cel(a1,1,1),cel(a1,2,2)]")
                             };


        httpHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(httpResponse);
        
        var httpClient = new HttpClient(httpHandlerMock.Object);

        // Mock the repository
        var tarefaRepoMock = new Mock<ITarefaRepo>();
        
        tarefaRepoMock.Setup(repo => repo.CreateAsync(It.IsAny<Tarefa>()))
            .ReturnsAsync((Tarefa tarefa) => tarefa);        
        

        // Create the service
        var tarefaService = new TarefaService(tarefaRepoMock.Object, httpClient);

        // Params
        CriarTarefaDTO criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "PICkUPDELIVERY";
        criarTarefaDTO.CodConfirmacao = "12345";
        criarTarefaDTO.DescricaoEntrega = "DESC";
        criarTarefaDTO.NomePickUp = "NOMEPCIKUP";
        criarTarefaDTO.NumeroPickUp = "123456789";
        criarTarefaDTO.NomeDelivery = "NOMEDELIVERY";
        criarTarefaDTO.NumeroDelivery = "987654321";
        criarTarefaDTO.SalaInicial = "A201";
        criarTarefaDTO.SalaFinal = "A202";
        criarTarefaDTO.Email = "email@email.com";


        var res = await tarefaService.criarTarefa(criarTarefaDTO,"token");

        Assert.Equal(expectedTarefa.getCodConfirmacaoString(), res.CodConfirmacao);
        Assert.Equal(expectedTarefa.getDescricaoEntregaString(), res.DescricaoEntrega);
        Assert.Equal(expectedTarefa.getNomeContactoPickUpString(), res.NomePickUp);
        Assert.Equal(expectedTarefa.getNumeroContactoPickUpString(), res.NumeroPickUp);
        Assert.Equal(expectedTarefa.getNomeContactoDeliveryString(), res.NomeDelivery);
        Assert.Equal(expectedTarefa.getNumeroContactoDeliveryString(), res.NumeroDelivery);
        Assert.Equal(expectedTarefa.getNomeSalaInicialString(), res.SalaInicial);
        Assert.Equal(expectedTarefa.getNomeSalaFinalString(), res.SalaFinal);
    }

    [Fact]
    public async void GetTarefasPendentesDevolveDTOs() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var tarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    

        var tarefa2 = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    

        var tarefa3 = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    

        var tarefas = new List<Tarefa>();
        tarefas.Add(tarefa);
        tarefas.Add(tarefa2);
        tarefas.Add(tarefa3);

        tarefaRepo.Setup(repo => repo.GetTarefasPendentesAsync())
            .ReturnsAsync(tarefas);

        var res = await tarefaService.listarTarefasPendentes();

        Assert.Equal(3, res.Count);
    }

    [Fact]
    public async void GetTarefasPendentesDevolveDTOPretendido() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var tarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    


        var dto = new TarefaDTO(
            "id","[cel(a1,1,1),cel(a1,2,2)]","Pendente",
            "emailplaceholder","","12345","DESC",
            "NOMEPCIKUP","123456789","NOMEDELIVERY","987654321",
            "A201","A202"
        );
        
        var tarefas = new List<Tarefa>();
        tarefas.Add(tarefa);
        

        tarefaRepo.Setup(repo => repo.GetTarefasPendentesAsync())
            .ReturnsAsync(tarefas);

        var res = await tarefaService.listarTarefasPendentes();

        Assert.Equal(res[0].TipoTarefa, dto.TipoTarefa);
        Assert.Equal(res[0].Id, dto.Id);
        Assert.Equal(res[0].PercursoString, dto.PercursoString);
        Assert.Equal(res[0].EstadoString, dto.EstadoString);
        Assert.Equal(res[0].EmailRequisitor, dto.EmailRequisitor);
        Assert.Equal(res[0].CodDispositivo, dto.CodDispositivo);
        Assert.Equal(res[0].CodConfirmacao, dto.CodConfirmacao);
        Assert.Equal(res[0].DescricaoEntrega, dto.DescricaoEntrega);
        Assert.Equal(res[0].NomePickUp, dto.NomePickUp);
        Assert.Equal(res[0].NumeroPickUp, dto.NumeroPickUp);
        Assert.Equal(res[0].NomeDelivery, dto.NomeDelivery);
        Assert.Equal(res[0].NumeroDelivery, dto.NumeroDelivery);
        Assert.Equal(res[0].SalaInicial, dto.SalaInicial);
        Assert.Equal(res[0].SalaFinal, dto.SalaFinal);
    }
        [Fact]
    public async void obterPercursoTarefaRetornaPercurso() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());
        var tarefaId = "id";
        string percurso = "[cel(a1,1,1),cel(a1,2,2)]";
        
        var tarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    

        tarefaRepo.Setup(repo => repo.GetAsync(It.IsAny<string>()))
            .ReturnsAsync(tarefa);

        var answer = await tarefaService.obterPercursoTarefa(tarefaId);
        
        Assert.Equal(percurso, answer);
    }

        public async void obterPercursoTarefaErradaFalha() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());
        var tarefaId = "id";
    

        tarefaRepo.Setup(repo => repo.GetAsync(It.IsAny<string>()))
            .ReturnsAsync((Tarefa)null);



        async Task ActAsync() =>  await tarefaService.obterPercursoTarefa(tarefaId);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tarefa não existe", exception.Message);
    }

    [Fact]
    public async void alterarEstadoDaTarefaTemSucessoParaAceite() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var tarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    


        var returnDTO = new TarefaDTO(
            "id","[cel(a1,1,1),cel(a1,2,2)]","Aceite",
            "emailplaceholder","Robo1","12345","DESC",
            "NOMEPCIKUP","123456789","NOMEDELIVERY","987654321",
            "A201","A202"
        );
        
        var tarefaDTO = new AlterarEstadoDaTarefaDTO();
        tarefaDTO.Id = "id";
        tarefaDTO.Estado = "Aceite";
        tarefaDTO.CodigoRobo = "Robo1";

        tarefaRepo.Setup(repo => repo.GetAsync(It.IsAny<string>()))
            .ReturnsAsync(tarefa);
        tarefaRepo.Setup(repo => repo.UpdateAsync(It.IsAny<string>(), It.IsAny<Tarefa>()));
            

        var res = await tarefaService.alterarEstadoDaTarefa(tarefaDTO);

        Assert.Equal(res.TipoTarefa, returnDTO.TipoTarefa);
        Assert.Equal(res.Id, returnDTO.Id);
        Assert.Equal(res.PercursoString, returnDTO.PercursoString);
        Assert.Equal(res.EstadoString, returnDTO.EstadoString);
        Assert.Equal(res.EmailRequisitor, returnDTO.EmailRequisitor);
        Assert.Equal(res.CodDispositivo, returnDTO.CodDispositivo);
        Assert.Equal(res.CodConfirmacao, returnDTO.CodConfirmacao);
        Assert.Equal(res.DescricaoEntrega, returnDTO.DescricaoEntrega);
        Assert.Equal(res.NomePickUp, returnDTO.NomePickUp);
        Assert.Equal(res.NumeroPickUp, returnDTO.NumeroPickUp);
        Assert.Equal(res.NomeDelivery, returnDTO.NomeDelivery);
        Assert.Equal(res.NumeroDelivery, returnDTO.NumeroDelivery);
        Assert.Equal(res.SalaInicial, returnDTO.SalaInicial);
        Assert.Equal(res.SalaFinal, returnDTO.SalaFinal);
    } 

    [Fact]
    public async void alterarEstadoDaTarefaFalhaSeEstadoAceiteENaoExistirRobo() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var tarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    


        var returnDTO = new TarefaDTO(
            "id","[cel(a1,1,1),cel(a1,2,2)]","Aceite",
            "emailplaceholder","Robo1","12345","DESC",
            "NOMEPCIKUP","123456789","NOMEDELIVERY","987654321",
            "A201","A202"
        );
        
        var tarefaDTO = new AlterarEstadoDaTarefaDTO();
        tarefaDTO.Id = "id";
        tarefaDTO.Estado = "Aceite";

        tarefaRepo.Setup(repo => repo.GetAsync(It.IsAny<string>()))
            .ReturnsAsync(tarefa);

        async Task ActAsync() =>  await tarefaService.alterarEstadoDaTarefa(tarefaDTO);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Código do robô é obrigatório caso a tarefa seja aceite", exception.Message);


    } 


    [Fact]
    public async void alterarEstadoDaTarefaFalhaEstadoInvalido() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var tarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    

        
        var tarefaDTO = new AlterarEstadoDaTarefaDTO();
        tarefaDTO.Id = "id";
        tarefaDTO.Estado = "asasjkj";

        tarefaRepo.Setup(repo => repo.GetAsync(It.IsAny<string>()))
            .ReturnsAsync(tarefa);

        async Task ActAsync() =>  await tarefaService.alterarEstadoDaTarefa(tarefaDTO);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Estado inválido", exception.Message);
       
    } 

    [Fact]
    public async void alterarEstadoDaTarefaFalhaSeATarefaNaoExistir() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var tarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    

        
        var tarefaDTO = new AlterarEstadoDaTarefaDTO();
        tarefaDTO.Id = "id";
        tarefaDTO.Estado = "Rejeitado";

        tarefaRepo.Setup(repo => repo.GetAsync(It.IsAny<string>()))
            .ReturnsAsync((Tarefa)null);

        async Task ActAsync() =>  await tarefaService.alterarEstadoDaTarefa(tarefaDTO);

        var exception = await Assert.ThrowsAsync<NotFoundException>(ActAsync);

        Assert.Equal("Tarefa não existe", exception.Message);
    } 

    [Fact]
    public async void alterarEstadoDaTarefaFalhaSeNaoExistirId() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var tarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    

        
        var tarefaDTO = new AlterarEstadoDaTarefaDTO();
        tarefaDTO.Estado = "Rejeitado";

        async Task ActAsync() =>  await tarefaService.alterarEstadoDaTarefa(tarefaDTO);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Id e estado da tarefa são obrigatórios", exception.Message);
    } 

    [Fact]

    public async void listarTarefasPendentesRetornaAsTarefasExistentes() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());
        var tarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY","A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );

        var listaTarefas = new List<Tarefa>();
        listaTarefas.Add(tarefa);

        tarefaRepo.Setup(repo => repo.GetTarefasPendentesAsync())
            .ReturnsAsync(listaTarefas);

        var res = await tarefaService.listarTarefasPendentes();
        Assert.True(res.ToArray().Length == 1);
    }

        public async void listarTarefasPendentesSemTarefasPendentes() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var listaTarefas = new List<Tarefa>();

        tarefaRepo.Setup(repo => repo.GetTarefasPendentesAsync())
            .ReturnsAsync(listaTarefas);

        var res = await tarefaService.listarTarefasPendentes();
        Assert.True(res.ToArray().Length == 0);
    }

}