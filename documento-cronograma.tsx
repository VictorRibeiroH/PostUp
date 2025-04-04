const CronogramaPostUp = () => {
  return (
    <div className="document">
      {/* Capa */}
      <div className="cover">
        <h1>CRONOGRAMA DE DESENVOLVIMENTO</h1>
        <h2>Projeto: PostUp - Plataforma de Marketing Digital</h2>
        <div className="project-details">
          <p>
            <strong>Cliente:</strong> [Nome do Cliente]
          </p>
          <p>
            <strong>Total de Horas:</strong> 70 horas
          </p>
          <p>
            <strong>Data de Início:</strong> [Data]
          </p>
          <p>
            <strong>Data de Conclusão Prevista:</strong> [Data]
          </p>
        </div>
      </div>

      {/* Introdução */}
      <div className="introduction">
        <h2>VISÃO GERAL DO PROJETO</h2>
        <p>
          O projeto PostUp consiste no desenvolvimento de uma plataforma completa de marketing digital com sistema de
          assinaturas, focada em atender diversos segmentos de mercado. A plataforma oferecerá funcionalidades de gestão
          de conteúdo, planejamento, anúncios e insights, com diferentes níveis de acesso baseados no plano de
          assinatura do usuário.
        </p>
        <p>
          Este documento apresenta o cronograma detalhado de desenvolvimento, dividido em etapas de implementação, com o
          objetivo de entregar uma solução completa e funcional dentro do prazo estabelecido de 70 horas de trabalho.
        </p>
      </div>

      {/* Cronograma Detalhado */}
      <div className="timeline">
        <h2>CRONOGRAMA DETALHADO</h2>

        {/* Horas 0-2 */}
        <div className="time-block">
          <h3>HORAS 0-2: PLANEJAMENTO E ESTRUTURAÇÃO DO BANCO DE DADOS</h3>
          <div className="activities">
            <h4>Atividades realizadas:</h4>
            <ul>
              <li>Reunião inicial para entendimento dos requisitos do projeto</li>
              <li>Definição da arquitetura da aplicação (Next.js, PostgreSQL, Tailwind CSS)</li>
              <li>
                Modelagem do banco de dados com as seguintes tabelas:
                <ul>
                  <li>Segmentos (alimentação, saúde, esporte, etc.)</li>
                  <li>Planos de assinatura (Start, Plus, Premium Content, etc.)</li>
                  <li>Usuários (com segmentação)</li>
                  <li>Assinaturas (vinculando usuários a planos)</li>
                  <li>Conteúdos/Artes</li>
                  <li>Notificações</li>
                  <li>Eventos do planner</li>
                  <li>Anúncios</li>
                </ul>
              </li>
              <li>Criação dos scripts SQL para criação das tabelas</li>
              <li>Configuração inicial do ambiente de desenvolvimento</li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li>Diagrama de entidade-relacionamento do banco de dados</li>
              <li>Scripts SQL para criação das tabelas</li>
              <li>Ambiente de desenvolvimento configurado</li>
            </ul>
          </div>
        </div>

        {/* Horas 2-4 */}
        <div className="time-block">
          <h3>HORAS 2-4: DESENVOLVIMENTO DO SISTEMA DE AUTENTICAÇÃO E LANDING PAGE</h3>
          <div className="activities">
            <h4>Atividades realizadas:</h4>
            <ul>
              <li>Implementação do sistema de autenticação (login/registro)</li>
              <li>
                Desenvolvimento da landing page com:
                <ul>
                  <li>Apresentação da plataforma</li>
                  <li>Exibição dos planos disponíveis</li>
                  <li>Seção de segmentos atendidos</li>
                </ul>
              </li>
              <li>Criação do fluxo de registro com seleção de segmento e plano</li>
              <li>Implementação da navegação básica e rotas protegidas</li>
              <li>Configuração do sistema de sessão e cookies</li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li>Sistema de autenticação funcional (login/registro)</li>
              <li>Landing page responsiva</li>
              <li>Fluxo de registro com seleção de plano</li>
            </ul>
          </div>
        </div>

        {/* Horas 4-6 */}
        <div className="time-block">
          <h3>HORAS 4-6: DESENVOLVIMENTO DO DASHBOARD E SIDEBAR</h3>
          <div className="activities">
            <h4>Atividades realizadas:</h4>
            <ul>
              <li>Criação do layout principal do dashboard</li>
              <li>
                Implementação da sidebar responsiva com:
                <ul>
                  <li>Links de navegação</li>
                  <li>Controle de acesso baseado no plano do usuário</li>
                  <li>Perfil do usuário</li>
                </ul>
              </li>
              <li>
                Desenvolvimento da página inicial do dashboard com:
                <ul>
                  <li>Resumo do plano atual</li>
                  <li>Atalhos personalizáveis</li>
                  <li>Visão geral de conteúdos</li>
                  <li>Notificações</li>
                </ul>
              </li>
              <li>Implementação da página de conteúdos com listagem de artes</li>
              <li>Configuração do controle de acesso baseado em assinatura</li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li>Dashboard responsivo com sidebar</li>
              <li>Página inicial do dashboard com widgets</li>
              <li>Página de listagem de conteúdos</li>
              <li>Sistema de controle de acesso baseado em plano</li>
            </ul>
          </div>
        </div>

        {/* Horas 6-10 */}
        <div className="time-block empty">
          <h3>HORAS 6-10:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 10-15 */}
        <div className="time-block empty">
          <h3>HORAS 10-15:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 15-20 */}
        <div className="time-block empty">
          <h3>HORAS 15-20:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 20-25 */}
        <div className="time-block empty">
          <h3>HORAS 20-25:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 25-30 */}
        <div className="time-block empty">
          <h3>HORAS 25-30:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 30-35 */}
        <div className="time-block empty">
          <h3>HORAS 30-35:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 35-40 */}
        <div className="time-block empty">
          <h3>HORAS 35-40:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 40-45 */}
        <div className="time-block empty">
          <h3>HORAS 40-45:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 45-50 */}
        <div className="time-block empty">
          <h3>HORAS 45-50:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 50-55 */}
        <div className="time-block empty">
          <h3>HORAS 50-55:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 55-60 */}
        <div className="time-block empty">
          <h3>HORAS 55-60:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 60-65 */}
        <div className="time-block empty">
          <h3>HORAS 60-65:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* Horas 65-70 */}
        <div className="time-block empty">
          <h3>HORAS 65-70:</h3>
          <div className="activities">
            <h4>Atividades planejadas:</h4>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="deliverables">
            <h4>Entregáveis:</h4>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conclusão */}
      <div className="conclusion">
        <h2>CONSIDERAÇÕES FINAIS</h2>
        <p>
          Este cronograma foi elaborado considerando as melhores práticas de desenvolvimento e as necessidades
          específicas do projeto PostUp. As horas estimadas para cada etapa podem sofrer pequenos ajustes conforme o
          andamento do projeto, mas o prazo final de entrega será mantido.
        </p>
        <p>
          Ao final das 70 horas de desenvolvimento, será entregue uma plataforma completa, funcional e pronta para uso,
          atendendo a todos os requisitos especificados pelo cliente.
        </p>
      </div>

      {/* Assinatura */}
      <div className="signature">
        <p>Desenvolvido por:</p>
        <p className="name">[Víctor Ribeiro]</p>
        <div className="logo-placeholder">[ESPAÇO PARA LOGOMARCA POWERLIBS]</div>
      </div>
    </div>
  )
}

export default CronogramaPostUp

