export default interface TokenData {
  addresses: { chainId: number; address: string }[];
  decimals: number;
  symbol: string;
  tokenPriceUSD: number;
}
