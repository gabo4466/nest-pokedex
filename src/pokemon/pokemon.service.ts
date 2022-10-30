import { isValidObjectId, Model } from 'mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    let pokemon;
    try {
      pokemon = await this.pokemonModel.create(createPokemonDto);
    } catch (error) {
      this.handleExceptions(error);
    }
    return pokemon;
  }

  findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      .select('-__v');
    //el select esta removiendo la propiedad __v gracias al -
    //en sort pones la propiedad por la que deseas ordenar y el valor numero indica ascendente o descendente
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    } else if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }

    if (!pokemon) {
      throw new NotFoundException(`Could not find pokemon by '${term}'`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
    } catch (error) {
      this.handleExceptions(error);
    }

    let result = {
      ...pokemon.toJSON(),
      ...updatePokemonDto
    }

    return result;
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id '${id}' not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists with ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Something went wrong...`);
  }

}
