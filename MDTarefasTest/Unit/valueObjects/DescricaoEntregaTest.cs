using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;
using System;
using System.Text;

namespace MDTarefasTest.Unit;

public class DescricaoEntregaTest {

    [Fact]
    public void ensureDescricaoNotNull() {
        
        Action act = () => new DescricaoEntrega(null);

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Descrição de entrega deve ter apenas caracteres alfuanuméricos e espaços, ter no máximo 1000 caracteres e não pode ser vazia, nula ou apenas conter espaços",exception.Message);
    }

    [Fact]
    public void ensureDescricaoNotEmpty() {
        
        Action act = () => new DescricaoEntrega("");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Descrição de entrega deve ter apenas caracteres alfuanuméricos e espaços, ter no máximo 1000 caracteres e não pode ser vazia, nula ou apenas conter espaços",exception.Message);
    }

    [Fact]
    public void ensureDescricaoNotBlank() {
        
        Action act = () => new DescricaoEntrega("            ");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Descrição de entrega deve ter apenas caracteres alfuanuméricos e espaços, ter no máximo 1000 caracteres e não pode ser vazia, nula ou apenas conter espaços",exception.Message);
    }



    [Fact]
    public void ensureDescricaoCantHaveSpecialChars() {
        
        Action act = () => new DescricaoEntrega(" TESTE DESCRICAO @@@@");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);
        
        Assert.Equal("Descrição de entrega deve ter apenas caracteres alfuanuméricos e espaços, ter no máximo 1000 caracteres e não pode ser vazia, nula ou apenas conter espaços",exception.Message);
    }

    [Fact]
    public void ensureDescricaoCantHaveMoreThan1000Chars() {

        StringBuilder s = new StringBuilder();
        for (int i = 0; i < 1001; i++) {
            s.Append("a");
        }
        string descricao = s.ToString();
        
        Action act = () => new DescricaoEntrega(descricao);

        var exception = Assert.Throws<BusinessRuleValidationException>(act);
        
        Assert.Equal("Descrição de entrega deve ter apenas caracteres alfuanuméricos e espaços, ter no máximo 1000 caracteres e não pode ser vazia, nula ou apenas conter espaços",exception.Message);
    }

    [Fact]
    public void ensureValidDescricaoIsCreated() {

        var desc =  new DescricaoEntrega("descricao");

        Assert.NotNull(desc);
        Assert.Equal("descricao",desc.getDescricaoEntregaString());
    }
}