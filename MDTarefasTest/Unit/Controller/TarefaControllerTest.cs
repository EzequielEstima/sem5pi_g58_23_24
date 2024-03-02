using MDTarefas.Services.ImplServices;
using Microsoft.AspNetCore.Http;

namespace MDTarefasTest.Unit.Controller
{
    public class TarefaControllerTest
    {
        [Fact]
        public async void ensureInvalidParametersReturnsBadRequest()
        {
            var serviceMock = new Mock<ITarefaService>();
            var authMock = new Mock<IAuthService>();
 
            var errorMessage = "Tipo de tarefa inválido";
            serviceMock.Setup(service => service.criarTarefa(It.IsAny<CriarTarefaDTO>(), It.IsAny<string>()))
                .ThrowsAsync(new BusinessRuleValidationException(errorMessage));
            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            authMock.Setup(auth => auth.GetEmail(It.IsAny<HttpRequest>()))
                .Returns("email@email.com");
            authMock.Setup(auth => auth.GetToken(It.IsAny<HttpRequest>()))
                .Returns("token");
            var controller = new TarefaController(serviceMock.Object, authMock.Object);

            CriarTarefaDTO criarTarefaDTO = new CriarTarefaDTO();
            criarTarefaDTO.TipoTarefa = "FAIL";

            var res = await controller.Create(criarTarefaDTO);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(res.Result);
            Assert.Equal(errorMessage, badRequestResult.Value);

        }

        [Fact]
        public async void ensureValidParametersReturnsCreated()
        {
            var serviceMock = new Mock<ITarefaService>();
            var authMock = new Mock<IAuthService>();
 
            TarefaDTO returnTarefaDTO = new TarefaDTO();
            returnTarefaDTO.Id = "id";
            returnTarefaDTO.TipoTarefa = "PickUpDelivery";
            returnTarefaDTO.CodConfirmacao = "12345";
            returnTarefaDTO.DescricaoEntrega = "DESC";
            returnTarefaDTO.NomePickUp = "NOMEPCIKUP";
            returnTarefaDTO.NumeroPickUp = "123456789";
            returnTarefaDTO.NomeDelivery = "NOMEDELIVERY";
            returnTarefaDTO.NumeroDelivery = "987654321";
            returnTarefaDTO.SalaInicial = "A201";
            returnTarefaDTO.SalaFinal = "A202";

            serviceMock.Setup(service => service.criarTarefa(It.IsAny<CriarTarefaDTO>(), It.IsAny<string>()))
                .ReturnsAsync(returnTarefaDTO);
            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            authMock.Setup(auth => auth.GetEmail(It.IsAny<HttpRequest>()))
                .Returns("email@email.com");
            authMock.Setup(auth => auth.GetToken(It.IsAny<HttpRequest>()))
                .Returns("token");
            var controller = new TarefaController(serviceMock.Object, authMock.Object);

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

            var res = await controller.Create(criarTarefaDTO);

            var requestResult = Assert.IsType<CreatedResult>(res.Result);
            
            Assert.Equal(requestResult.Value, returnTarefaDTO);

        }

        [Fact]
        public async void ControllerServiceValidParametersReturnsCreated()
        {
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
            var authMock = new Mock<IAuthService>();
 
            tarefaRepoMock.Setup(repo => repo.CreateAsync(It.IsAny<Tarefa>()))
                .ReturnsAsync((Tarefa tarefa) => tarefa);        
            
            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            authMock.Setup(auth => auth.GetEmail(It.IsAny<HttpRequest>()))
                .Returns("email@email.com");
            authMock.Setup(auth => auth.GetToken(It.IsAny<HttpRequest>()))
                .Returns("token");
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

            

            var controller = new TarefaController(tarefaService, authMock.Object);

            var res = await controller.Create(criarTarefaDTO);

            var requestResult = Assert.IsType<CreatedResult>(res.Result);
            
            var dtoRes = Assert.IsType<TarefaDTO>(requestResult.Value);
            Assert.Equal("PickUpDelivery", dtoRes.TipoTarefa);
            Assert.Equal("12345", dtoRes.CodConfirmacao);
            Assert.Equal("DESC", dtoRes.DescricaoEntrega);
            Assert.Equal("NOMEPCIKUP", dtoRes.NomePickUp);
            Assert.Equal("123456789", dtoRes.NumeroPickUp);
            Assert.Equal("NOMEDELIVERY", dtoRes.NomeDelivery);
            Assert.Equal("987654321", dtoRes.NumeroDelivery);
            Assert.Equal("A201", dtoRes.SalaInicial);
            Assert.Equal("A202", dtoRes.SalaFinal);
            Assert.Equal("[cel(a1,1,1),cel(a1,2,2)]", dtoRes.PercursoString);
            Assert.Equal("email@email.com", dtoRes.EmailRequisitor);
        }

        
        [Fact]
        public async void listarTarefasPendentesDevolveNotFoundCasoNaoExistamTarefas(){
            var serviceMock = new Mock<ITarefaService>();
            var authMock = new Mock<IAuthService>();
            serviceMock.Setup(service => service.listarTarefasPendentes())
                .ReturnsAsync(new List<TarefaDTO>());

            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            var controller = new TarefaController(serviceMock.Object, authMock.Object);
            

            var res = await controller.GetTarefasPendentes();

            var notFoundResult = Assert.IsType<NotFoundObjectResult>(res.Result);
            Assert.Equal(404, notFoundResult.StatusCode);
            Assert.Equal("Não existem tarefas pendentes", notFoundResult.Value);
        }

        [Fact]
        public async void listarTarefasPendentesDevolveTarefasPendentes(){
            var serviceMock = new Mock<ITarefaService>();
            var authMock = new Mock<IAuthService>();

            TarefaDTO tarefaDTO = new TarefaDTO();
            tarefaDTO.Id = "id";
            tarefaDTO.TipoTarefa = "PickUpDelivery";
            tarefaDTO.CodConfirmacao = "12345";
            tarefaDTO.DescricaoEntrega = "DESC";
            tarefaDTO.NomePickUp = "NOMEPCIKUP";
            tarefaDTO.NumeroPickUp = "123456789";
            tarefaDTO.NomeDelivery = "NOMEDELIVERY";
            tarefaDTO.NumeroDelivery = "987654321";
            tarefaDTO.SalaInicial = "A201";
            tarefaDTO.SalaFinal = "A202";
            tarefaDTO.PercursoString = "[cel(a1,1,1),cel(a1,2,2)]";


            serviceMock.Setup(service => service.listarTarefasPendentes())
                .ReturnsAsync(new List<TarefaDTO>(){tarefaDTO});
            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            var controller = new TarefaController(serviceMock.Object, authMock.Object);

            var res = await controller.GetTarefasPendentes();

            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            Assert.Equal(200, okResult.StatusCode);
            Assert.Equal(new List<TarefaDTO>(){tarefaDTO}, okResult.Value);
        }

        [Fact]
        public async void controllerServiceListarTarefasPendentesDevolveTarefasPendentes(){
            var tarefaRepoMock = new Mock<ITarefaRepo>();
            var authMock = new Mock<IAuthService>();
            var httpClient = new HttpClient();

            Tarefa tarefa = new PickUpDelivery(
                "12345","DESC",
                "123456789","NOMEPCIKUP",
                "987654321","NOMEDELIVERY",
                "A201","A202",
                "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
            );

            TarefaDTO tarefaDTO = new TarefaDTO();
            tarefaDTO.Id = "id";
            tarefaDTO.TipoTarefa = "PickUpDelivery";
            tarefaDTO.CodConfirmacao = "12345";
            tarefaDTO.DescricaoEntrega = "DESC";
            tarefaDTO.NomePickUp = "NOMEPCIKUP";
            tarefaDTO.NumeroPickUp = "123456789";
            tarefaDTO.NomeDelivery = "NOMEDELIVERY";
            tarefaDTO.NumeroDelivery = "987654321";
            tarefaDTO.SalaInicial = "A201";
            tarefaDTO.SalaFinal = "A202";
            tarefaDTO.PercursoString = "[cel(a1,1,1),cel(a1,2,2)]";


            tarefaRepoMock.Setup(repo => repo.GetTarefasPendentesAsync())
                .ReturnsAsync(new List<Tarefa>(){tarefa});
            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            var tarefaService = new TarefaService(tarefaRepoMock.Object, httpClient);

            var controller = new TarefaController(tarefaService, authMock.Object);

            var res = await controller.GetTarefasPendentes();

            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            Assert.Equal(200, okResult.StatusCode);
            var dtoRes = Assert.IsType<List<TarefaDTO>>(okResult.Value);

            Assert.Equal(tarefaDTO.Id, dtoRes[0].Id);
            Assert.Equal(tarefaDTO.TipoTarefa, dtoRes[0].TipoTarefa);
            Assert.Equal(tarefaDTO.CodConfirmacao, dtoRes[0].CodConfirmacao);
            Assert.Equal(tarefaDTO.DescricaoEntrega, dtoRes[0].DescricaoEntrega);
            Assert.Equal(tarefaDTO.NomePickUp, dtoRes[0].NomePickUp);
            Assert.Equal(tarefaDTO.NumeroPickUp, dtoRes[0].NumeroPickUp);
            Assert.Equal(tarefaDTO.NomeDelivery, dtoRes[0].NomeDelivery);
            Assert.Equal(tarefaDTO.NumeroDelivery, dtoRes[0].NumeroDelivery);
            Assert.Equal(tarefaDTO.SalaInicial, dtoRes[0].SalaInicial);
            Assert.Equal(tarefaDTO.SalaFinal, dtoRes[0].SalaFinal);
            Assert.Equal(tarefaDTO.PercursoString, dtoRes[0].PercursoString);

        }


        [Fact]
        public async void AlterarEstadoDaTarefaRetornaTarefa(){
            var serviceMock = new Mock<ITarefaService>();
            var authMock = new Mock<IAuthService>();
 

            TarefaDTO tarefaDTO = new TarefaDTO();
            tarefaDTO.Id = "id";
            tarefaDTO.TipoTarefa = "PickUpDelivery";
            tarefaDTO.CodConfirmacao = "12345";
            tarefaDTO.DescricaoEntrega = "DESC";
            tarefaDTO.NomePickUp = "NOMEPCIKUP";
            tarefaDTO.NumeroPickUp = "123456789";
            tarefaDTO.NomeDelivery = "NOMEDELIVERY";
            tarefaDTO.NumeroDelivery = "987654321";
            tarefaDTO.SalaInicial = "A201";
            tarefaDTO.SalaFinal = "A202";
            tarefaDTO.PercursoString = "[cel(a1,1,1),cel(a1,2,2)]";
            tarefaDTO.EstadoString = "Aceite";
            tarefaDTO.EmailRequisitor = "emailplaceholder";
            tarefaDTO.CodDispositivo = "Robo1";

            var alterarTarefaDTO = new AlterarEstadoDaTarefaDTO();
            alterarTarefaDTO.Id = "id";
            alterarTarefaDTO.Estado = "Aceite";
            alterarTarefaDTO.CodigoRobo = "Robo1";


            serviceMock.Setup(service => service.alterarEstadoDaTarefa(It.IsAny<AlterarEstadoDaTarefaDTO>()))
                .ReturnsAsync(tarefaDTO);
            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            var controller = new TarefaController(serviceMock.Object, authMock.Object);

            var res = await controller.AlterarEstadoDaTarefa(alterarTarefaDTO);

            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            Assert.Equal(200, okResult.StatusCode);
            Assert.Equal(tarefaDTO, okResult.Value);
        }

        [Fact]
        public async void AlterarEstadoDaTarefaRetornaBadRequestForBusinessRuleValidationException(){
            var serviceMock = new Mock<ITarefaService>();
            var authMock = new Mock<IAuthService>();
 

            var alterarTarefaDTO = new AlterarEstadoDaTarefaDTO();
            alterarTarefaDTO.Id = "id";
            alterarTarefaDTO.Estado = "Aceite";
            alterarTarefaDTO.CodigoRobo = "Robo1";

            var errorMessage = "Id e estado da tarefa são obrigatórios";
            serviceMock.Setup(service => service.alterarEstadoDaTarefa(It.IsAny<AlterarEstadoDaTarefaDTO>()))
                .ThrowsAsync(new BusinessRuleValidationException(errorMessage));
            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            var controller = new TarefaController(serviceMock.Object, authMock.Object);

            var res = await controller.AlterarEstadoDaTarefa(alterarTarefaDTO);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(res.Result);
            Assert.Equal(400, badRequestResult.StatusCode);
            Assert.Equal(errorMessage, badRequestResult.Value);
        }

        [Fact]
        public async void AlterarEstadoDaTarefaRetornaNotFoundForNotFoundException(){
            var serviceMock = new Mock<ITarefaService>();
            var authMock = new Mock<IAuthService>();
 

            var alterarTarefaDTO = new AlterarEstadoDaTarefaDTO();
            alterarTarefaDTO.Id = "id";
            alterarTarefaDTO.Estado = "Aceite";
            alterarTarefaDTO.CodigoRobo = "Robo1";

            var errorMessage = "Tarefa não existe";
            serviceMock.Setup(service => service.alterarEstadoDaTarefa(It.IsAny<AlterarEstadoDaTarefaDTO>()))
                .ThrowsAsync(new NotFoundException(errorMessage));
            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            var controller = new TarefaController(serviceMock.Object, authMock.Object);

            var res = await controller.AlterarEstadoDaTarefa(alterarTarefaDTO);

            var notFoundResult = Assert.IsType<NotFoundObjectResult>(res.Result);
            Assert.Equal(404, notFoundResult.StatusCode);
            Assert.Equal(errorMessage, notFoundResult.Value);
        }

        [Fact]
        public async void ControllerServiceAlterarEstadoDaTarefaRetornaTarefa(){
            var tarefaRepo = new Mock<ITarefaRepo>();
            var authMock = new Mock<IAuthService>();
 
            var httpClient = new HttpClient();

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

            var tarefaService = new TarefaService(tarefaRepo.Object, httpClient);

            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            var controller = new TarefaController(tarefaService, authMock.Object); 

            var res = await controller.AlterarEstadoDaTarefa(tarefaDTO);

            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            
            var dtoRes = Assert.IsType<TarefaDTO>(okResult.Value);


            Assert.Equal(200, okResult.StatusCode);
            Assert.Equal(returnDTO.Id, dtoRes.Id);
            Assert.Equal(returnDTO.TipoTarefa, dtoRes.TipoTarefa);
            Assert.Equal(returnDTO.CodConfirmacao, dtoRes.CodConfirmacao);
            Assert.Equal(returnDTO.DescricaoEntrega, dtoRes.DescricaoEntrega);
            Assert.Equal(returnDTO.NomePickUp, dtoRes.NomePickUp);
            Assert.Equal(returnDTO.NumeroPickUp, dtoRes.NumeroPickUp);
            Assert.Equal(returnDTO.NomeDelivery, dtoRes.NomeDelivery);
            Assert.Equal(returnDTO.NumeroDelivery, dtoRes.NumeroDelivery);
            Assert.Equal(returnDTO.SalaInicial, dtoRes.SalaInicial);
            Assert.Equal(returnDTO.SalaFinal, dtoRes.SalaFinal);
            Assert.Equal(returnDTO.PercursoString, dtoRes.PercursoString);
            Assert.Equal(returnDTO.EstadoString, dtoRes.EstadoString);
            Assert.Equal(returnDTO.EmailRequisitor, dtoRes.EmailRequisitor);
            Assert.Equal(returnDTO.CodDispositivo, dtoRes.CodDispositivo);

        }


        [Fact]
        public async void GetTarefasPendentesRetornaTarefas(){
            var serviceMock = new Mock<ITarefaService>();
            var authMock = new Mock<IAuthService>();

            TarefaDTO tarefaDTO = new TarefaDTO();
            tarefaDTO.Id = "id";
            tarefaDTO.TipoTarefa = "PickUpDelivery";
            tarefaDTO.CodConfirmacao = "12345";
            tarefaDTO.DescricaoEntrega = "DESC";
            tarefaDTO.NomePickUp = "NOMEPCIKUP";
            tarefaDTO.NumeroPickUp = "123456789";
            tarefaDTO.NomeDelivery = "NOMEDELIVERY";
            tarefaDTO.NumeroDelivery = "987654321";
            tarefaDTO.SalaInicial = "A201";
            tarefaDTO.SalaFinal = "A202";
            tarefaDTO.PercursoString = "[cel(a1,1,1),cel(a1,2,2)]";
            tarefaDTO.EstadoString = "Aceite";
            tarefaDTO.EmailRequisitor = "emailplaceholder";
            tarefaDTO.CodDispositivo = "Robo1";
            var tarefaDTOList = new List<TarefaDTO>(){tarefaDTO};

            serviceMock.Setup(service => service.listarTarefasPendentes())
                .ReturnsAsync(tarefaDTOList);
            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);

            var controller = new TarefaController(serviceMock.Object, authMock.Object);

            var res = await controller.GetTarefasPendentes();

            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            Assert.Equal(200, okResult.StatusCode);
            Assert.Equal(tarefaDTOList, okResult.Value);
        }

        public async void GetTarefasPendentesControllerServiceRetornaTarefas(){
            var tarefaRepo = new Mock<ITarefaRepo>();
            var authMock = new Mock<IAuthService>();

            TarefaDTO tarefaDTO = new TarefaDTO();
            tarefaDTO.Id = "id";
            tarefaDTO.TipoTarefa = "PickUpDelivery";
            tarefaDTO.CodConfirmacao = "12345";
            tarefaDTO.DescricaoEntrega = "DESC";
            tarefaDTO.NomePickUp = "NOMEPCIKUP";
            tarefaDTO.NumeroPickUp = "123456789";
            tarefaDTO.NomeDelivery = "NOMEDELIVERY";
            tarefaDTO.NumeroDelivery = "987654321";
            tarefaDTO.SalaInicial = "A201";
            tarefaDTO.SalaFinal = "A202";
            tarefaDTO.PercursoString = "[cel(a1,1,1),cel(a1,2,2)]";
            tarefaDTO.EstadoString = "Aceite";
            tarefaDTO.EmailRequisitor = "emailplaceholder";
            tarefaDTO.CodDispositivo = "Robo1";
            var tarefaDTOList = new List<TarefaDTO>(){tarefaDTO};

            var tarefa = new PickUpDelivery(
                tarefaDTO.CodConfirmacao,tarefaDTO.DescricaoEntrega,
                tarefaDTO.NumeroPickUp,tarefaDTO.NomePickUp,
                tarefaDTO.NumeroDelivery,tarefaDTO.NomeDelivery,
                tarefaDTO.SalaInicial,tarefaDTO.SalaFinal,
                tarefaDTO.PercursoString,tarefaDTO.EmailRequisitor,tarefaDTO.Id,tarefaDTO.CodDispositivo
            );
            var listaTarefas = new List<Tarefa>(){tarefa};

            tarefaRepo.Setup(repo => repo.GetTarefasPendentesAsync())
                .ReturnsAsync(listaTarefas);

            authMock.Setup(auth => auth.IsAuthenticated(It.IsAny<HttpRequest>()))
                .Returns(true);
            authMock.Setup(auth => auth.IsAuthorized(It.IsAny<HttpRequest>(), It.IsAny<string[]>()))
                .Returns(true);
            var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

            var controller = new TarefaController(tarefaService ,authMock.Object);

            var res = await controller.GetTarefasPendentes();

            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            Assert.Equal(200, okResult.StatusCode);
            Assert.Equal(tarefaDTOList, okResult.Value);
        }

    }
}