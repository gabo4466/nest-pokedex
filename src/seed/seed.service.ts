import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {

  }

  async excuteSeed() {

    await this.pokemonModel.deleteMany({});
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=493');
    const insertPromisesArray = [];
    const pokemonToInsert: {name:string, no:number}[] = [];

    data.results.forEach(async({ name, url }) => {
      const segments = url.split('/');
      const no:number = +segments[ segments.length-2 ];
      pokemonToInsert.push({name, no});
      // insertPromisesArray.push(this.pokemonModel.create({name, no}));
      // const pokemon = await this.pokemonModel.create({name, no});
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    // await Promise.all(insertPromisesArray);

    return `Seed executed`;
  }

}
