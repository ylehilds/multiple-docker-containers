const axios = require('axios');

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const movieName = request.query.name;

    if (!movieName) {
      return reply.status(400).send({ error: 'Movie name is required' });
    }

    try {
      const response = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: '<api-key>', // Replace with your valid OMDb API key
          t: movieName,
        },
      });

      const data = response.data;

      if (data && data.Title) {
        const cast = data.Actors ? data.Actors.split(', ').slice(0, 10) : [];
        return reply.send({
          movie: data.Title,
          cast: cast,
        });
      } else {
        return reply.status(404).send({ error: `Movie '${movieName}' not found or no data returned.` });
      }
    } catch (error) {
      fastify.log.error(error.response ? error.response.data : error.message);
      return reply.status(500).send({ error: 'Error fetching movie details' });
    }
  });
};
