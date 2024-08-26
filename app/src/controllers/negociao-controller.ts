import { domInjector } from "../decorators/dom-injector.js";
import { inspect } from "../decorators/inspect.js";
import { logarTempoDeExecucao } from "../decorators/logar-tempo-de-execucao.js";
import { DiaDaSemana } from "../enums/dias-da-semana.js";
import { Negociacao } from "../models/negociacao.js";
import { Negociacoes } from "../models/negociacoes.js";
import { negociacoesService } from "../services/negociacoes-service.js";
import { imprimir } from "../utils/imprimir.js";
import { MensagemView } from "../views/messagem-view.js";
import { NegociacoesView } from "../views/negociacoes-view.js";

export class NegociacaoController {
    @domInjector('#data')
    private inputData: HTMLInputElement;
    @domInjector('#quantidade')
    private inputQuantidade: HTMLInputElement;
    @domInjector('#valor')
    private inputValor: HTMLInputElement;
    private negociacoes: Negociacoes = new Negociacoes();
    private negociacoesView = new NegociacoesView('#negociacoesView');
    private mensagemView = new MensagemView('#mensagemView');
    private negociacoesService = new negociacoesService();

    constructor() {
        this.negociacoesView.update(this.negociacoes);
    }

    @inspect
    @logarTempoDeExecucao()
    public adiciona(): void {
        const negociacao = Negociacao.criaDe(
            this.inputData.value,
            this.inputQuantidade.value,
            this.inputValor.value
        );
        if (!this.diaUtil(negociacao.data)){
            this.mensagemView.update('Apenas negociações em dias úteis são aceitas')
        }
        this.negociacoes.adiciona(negociacao);
        imprimir(negociacao, this.negociacoes)
        this.limparFormulario();
        this.atualizaView();
        
    }

    public importaDados(): void {
        this.negociacoesService.obterNegociacoesDoDia()
        .then(negociacoesDehoje => {
            for(let negociacao of negociacoesDehoje) {
                this.negociacoes.adiciona(negociacao);
            }
            this.negociacoesView.update(this.negociacoes)
        })
    }

    private diaUtil(data: Date) {
        return data.getDay() > DiaDaSemana.DOMINGO && data.getDay() < DiaDaSemana.SABADO ;
    }

    private limparFormulario(): void {
        this.inputData.value = '';
        this.inputQuantidade.value = '';
        this.inputValor.value = '';

        this.inputData.focus();
    }

    private atualizaView(): void {
        this.negociacoesView.update(this.negociacoes);
        this.mensagemView.update('Negociação adicionada com sucesso');
    }

}