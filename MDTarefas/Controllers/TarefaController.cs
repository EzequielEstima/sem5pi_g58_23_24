using MDTarefas.dto;
using MDTarefas.Models.exceptions;
using MDTarefas.Models.tarefa;
using MDTarefas.Services;
using MDTarefas.Services.IServices;
using Microsoft.AspNetCore.Mvc;
using MDTarefas.Services.ImplServices;

namespace MDTarefas.Controller;

[ApiController]
[Route("/api/[controller]")]
public class TarefaController : ControllerBase
{
    private readonly ITarefaService _tarefaService;

    private readonly IAuthService _authService;

    public TarefaController(ITarefaService tarefaService, IAuthService authService)
    {
        _tarefaService = tarefaService;
        _authService = authService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TarefaDTO>>> Get() {
        try{
            if (!_authService.IsAuthenticated(Request)) {
                return Unauthorized("Não está autenticado");
            }else if (!_authService.IsAuthorized(Request, ["gestor de tarefas"])) {
                return Forbid("Não tem permissões para aceder a este recurso");
            }
        }catch (Exception e){
            return Unauthorized(e.Message);
        }
        var tarefas = await _tarefaService.listarTarefas();
        return Ok(tarefas);
    }

    [HttpPost]
    public async Task<ActionResult<TarefaDTO>> Create(CriarTarefaDTO tarefa)
    {
        // Auth
        try{
            if (!_authService.IsAuthenticated(Request)) {
                return Unauthorized("Não está autenticado");
            }else if (!_authService.IsAuthorized(Request, ["utente"])) {
                return Forbid("Não tem permissões para aceder a este recurso");
            }
        }catch (Exception e){
            return Unauthorized(e.Message);
        }

        try {
            var email = _authService.GetEmail(Request);
            if (email == null) {
                return Unauthorized("Não foi possível obter o email do utilizador autenticado");
            }
            tarefa.Email = email;

            var token = _authService.GetToken(Request);
            if (token == null) {
                return Unauthorized("Não foi possível obter o token do utilizador autenticado");
            }
            
            TarefaDTO tarefacriada = await _tarefaService.criarTarefa(tarefa, token);
            
            return Created(tarefacriada.Id,tarefacriada);  
        
        } catch (BusinessRuleValidationException e) {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("tarefasPendentes")]
    public async Task<ActionResult<TarefaDTO>> GetTarefasPendentes()
    {
        try{
            if (!_authService.IsAuthenticated(Request)) {
                return Unauthorized("Não está autenticado");
            }else if (!_authService.IsAuthorized(Request, ["gestor de tarefas"])) {
                return Forbid("Não tem permissões para aceder a este recurso");
            }
        }catch (Exception e){
            return Unauthorized(e.Message);
        }

        var tarefa = await _tarefaService.listarTarefasPendentes();

        if (!tarefa.Any())
        {
            return NotFound("Não existem tarefas pendentes");
        }

        return Ok(tarefa);
    }
    
    [HttpDelete]
    public async Task<IActionResult> Delete([FromQuery] string id)
    {
        try{
            if (!_authService.IsAuthenticated(Request)) {
                return Unauthorized("Não está autenticado");
            }else if (!_authService.IsAuthorized(Request, ["gestor de tarefas"])) {
                return Forbid("Não tem permissões para aceder a este recurso");
            }
        }catch (Exception e){
            return Unauthorized(e.Message);
        }
        try {
            await _tarefaService.removerTarefaPorId(id);
            return Ok("Removido com sucesso"); 
        } catch (NotFoundException e) {
            return NotFound(e.Message);
        }

    }

    [HttpPut]
    public async Task<ActionResult<TarefaDTO>> AlterarEstadoDaTarefa(AlterarEstadoDaTarefaDTO alterarTarefaDTO)
    {
        try{
            if (!_authService.IsAuthenticated(Request)) {
                return Unauthorized("Não está autenticado");
            }else if (!_authService.IsAuthorized(Request, ["gestor de tarefas"])) {
                return Forbid("Não tem permissões para aceder a este recurso");
            }
        }catch (Exception e){
            return Unauthorized(e.Message);
        }
        try {
            TarefaDTO tarefa = await _tarefaService.alterarEstadoDaTarefa(alterarTarefaDTO);
            return Ok(tarefa);  
        } catch (BusinessRuleValidationException e) {
            return BadRequest(e.Message);
        }catch (NotFoundException e) {
            return NotFound(e.Message);
        }catch (Exception e) {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("carregarTarefasNoPlaneamento")]
    public async Task<ActionResult<TarefaDTO>> CarregarTarefasNoPlaneamento([FromQuery] int algoritmo)
    {

        try{
            if (!_authService.IsAuthenticated(Request)) {
                return Unauthorized("Não está autenticado");
            }else if (!_authService.IsAuthorized(Request, ["gestor de tarefas"])) {
                return Forbid("Não tem permissões para aceder a este recurso");
            }
        }catch (Exception e){
            return Unauthorized(e.Message);
        }

        try {
            var res = await _tarefaService.carregarTarefasNoPlaneamento(algoritmo);
            return Ok(res);  
        } catch (BusinessRuleValidationException e) {
            return BadRequest(e.Message);
        }catch (NotFoundException e) {
            return NotFound(e.Message);
        }catch (Exception e) {
            return BadRequest(e.Message);
        }
    }

    
    [HttpGet("obterTarefasPorCriterio")]
    public async Task<ActionResult<List<TarefaDTO>>> ObterTarefasPorCriterio([FromQuery] string criterio, [FromQuery] string valor)
    {
        try{
            if (!_authService.IsAuthenticated(Request)) {
                return Unauthorized("Não está autenticado");
            }else if (!_authService.IsAuthorized(Request, ["gestor de tarefas"])) {
                return Forbid("Não tem permissões para aceder a este recurso");
            }
        }catch (Exception e){
            return Unauthorized(e.Message);
        }

        try {
            var res = await _tarefaService.obterTarefasPorCriterio(criterio,valor);
            return Ok(res);  
        } catch (BusinessRuleValidationException e) {
            return BadRequest(e.Message);
        }catch (NotFoundException e) {
            return NotFound(e.Message);
        }catch (Exception e) {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("obterPercursoTarefa")]
    public async Task<ActionResult<string>> obterPercursoTarefa([FromQuery] string idTarefa)
    {
        try{
            if (!_authService.IsAuthenticated(Request)) {
                return Unauthorized("Não está autenticado");
            }else if (!_authService.IsAuthorized(Request, ["gestor de tarefas"])) {
                return Forbid("Não tem permissões para aceder a este recurso");
            }
        }catch (Exception e){
            return Unauthorized(e.Message);
        }
        try {
            var res = await _tarefaService.obterPercursoTarefa(idTarefa);
            return Ok(res);
        } catch (BusinessRuleValidationException e) {
            return BadRequest(e.Message);
        }catch (NotFoundException e) {
            return NotFound(e.Message);
        }catch (Exception e) {
            return BadRequest(e.Message);
        }
    }

}