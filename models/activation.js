import email from "infra/email.js";
import database from "infra/database";
import webserver from "infra/webserver.js";
import { ForbiddenError, NotFoundError } from "infra/errors";
import user from "models/user.js";
import authorization from "models/authorization.js";

const EXPIRATION_IN_MILLESECONDS = 60 * 15 * 1000; // 15 minutos

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLESECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          user_activation_tokens (user_id, expires_at)
        VALUES
          ($1, $2)
        RETURNING
          *
        ;`,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "<contato@gmail.com>",
    to: user.email,
    subject: "Ative seu cadastro no apptab",
    text: `${user.username}, clique no link abaixo para ativar o seu cadastro:
    
${webserver.origin}/cadastro/ativar/${activationToken.id}

Atenciosamente,
Equipe Apptab
    `,
  });
}

async function findOneValidById(tokenId) {
  const tokenValidate = await runSelectQuery(tokenId);
  return tokenValidate;

  async function runSelectQuery(tokenId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          user_activation_tokens
        WHERE
          id = $1
          AND expires_at > NOW()
          AND used_at IS NULL
        LIMIT
          1
        ;`,
      values: [tokenId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O token de ativação não foi encontrado no sistema ou expirou",
        action: "Faça um novo cadastro",
      });
    }

    return results.rows[0];
  }
}

async function markTokenAsUsed(tokenId) {
  const usedActivationTokens = await runUpdateQuery(tokenId);
  return usedActivationTokens;

  async function runUpdateQuery(tokenId) {
    const results = await database.query({
      text: `
        UPDATE
          user_activation_tokens
        SET
          used_at = timezone('utc', now()),
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
        ;`,
      values: [tokenId],
    });

    return results.rows[0];
  }
}

async function activateUserByUserId(userId) {
  const userToActivate = await user.findOneById(userId);
  console.log(userToActivate);

  if (!authorization.can(userToActivate, "read:activation_token")) {
    throw new ForbiddenError({
      message: "Você não pode mais utilizar tokens de ativação",
      action: "Entre em contato com o suporte",
    });
  }

  const activatedUser = await user.setFeatures(userId, [
    "create:session",
    "read:session",
  ]);
  return activatedUser;
}

const activation = {
  sendEmailToUser,
  create,
  findOneValidById,
  markTokenAsUsed,
  activateUserByUserId,
  EXPIRATION_IN_MILLESECONDS,
};

export default activation;
