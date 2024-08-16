# Public Database Structure Disclaimer

| Name               | Description                                        | Installed Schema | GitHub                                                                                                     | Docs                                                                            | Version |
| ------------------ | -------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------- |
| pg_graphql         | GraphQL support                                    | graphql          | [GitHub](https://github.com/supabase/pg_graphql)                                                           | [Docs](https://supabase.com/docs/guides/database/extensions/pg_graphql)         | 1.5.6   |
| pgjwt              | JSON Web Token API for PostgreSQL                  | extensions       | [GitHub](https://github.com/michelp/pgjwt)                                                                 | [Docs](https://supabase.com/docs/guides/database/extensions/pgjwt)              | 0.2.0   |
| pg_stat_statements | Track planning and execution statistics of all SQL | extensions       | [GitHub](https://github.com/postgres/postgres/blob/master/contrib/pg_stat_statements/pg_stat_statements.c) | [Docs](https://supabase.com/docs/guides/database/extensions/pg_stat_statements) | 1.10    |
| uuid-ossp          | Generate universally unique identifiers (UUIDs)    | extensions       | [GitHub](https://github.com/postgres/postgres/blob/master/contrib/uuid-ossp/uuid-ossp.c)                   | [Docs](https://supabase.com/docs/guides/database/extensions/uuid-ossp)          | 1.1     |
| plpgsql            | PL/pgSQL procedural language                       | pg_catalog       | N/A                                                                                                        | [Docs](https://www.postgresql.org/docs/current/plpgsql.html)                    | 1.0     |
| pgsodium           | Postgres extension for libsodium functions         | pgsodium         | [GitHub](https://github.com/michelp/pgsodium)                                                              | [Docs](https://supabase.com/docs/guides/database/extensions/pgsodium)           | 3.1.8   |
| pgcrypto           | Cryptographic functions                            | extensions       | N/A                                                                                                        | [Docs](https://www.postgresql.org/docs/current/pgcrypto.html)                   | 1.3     |

## Purpose of Disclosure

The database structure and related information for this project are being made public for the following reasons:

1. **Community Contribution:** This application is designed to serve the Nikke: Goddess of Victory community. By making the database structure public, we invite community members to contribute ideas for improvement and optimization.

2. **Collaborative Development:** As the sole developer, I acknowledge that I may not have the optimal solutions for all aspects of the application. Sharing this information allows other developers to provide valuable insights and suggestions.

3. **Educational Purpose:** This disclosure serves as a learning resource for those interested in database design for gaming community applications.

4. **Transparency:** We believe in being open about our development process and architecture to build trust with our user base.

## Nature of Disclosed Information

The information shared includes:

- Database table structures
- SQL functions and views
- Extension configurations

It's important to note that this disclosure does not include any sensitive user data, authentication secrets, or proprietary game information.

## Development Environment Note

Currently, this project does not use Docker for development due to hardware limitations. We apologize for any inconvenience this may cause to contributors who prefer containerized environments.

## Legal and Ethical Considerations

While we strive to make this project as open as possible, we remind all viewers and potential contributors to respect intellectual property rights. The database structure is designed specifically for our community application and should not be used in any way that violates the terms of service of Nikke: Goddess of Victory or infringes upon the rights of Shift Up Corporation or any other entities.

## Contribution and Feedback

We welcome constructive feedback and suggestions for improving the database structure and overall application architecture. If you have ideas or spot potential improvements, please feel free to open an issue or submit a pull request.

Thank you for your interest in our project and for respecting these guidelines.
