
type Pair<K, V> = {
    first: K;
    second: V;
};

export default interface IListarPisoComPassagensDTO {
    mapIdPassagemPairIdPiso: Pair<number, Pair<number, number>>[];
    pairNumeroPisoIdPisoPairDescricao: Pair<Pair<number, number>,string>[];
    pairIdPisoIdEdificio: Pair<number, string>[];
}