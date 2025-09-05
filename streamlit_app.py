import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime

# セッション状態の初期化
if 'current_step' not in st.session_state:
    st.session_state.current_step = 1
if 'cart' not in st.session_state:
    st.session_state.cart = []
if 'sales_data' not in st.session_state:
    # 初期サンプルデータ
    st.session_state.sales_data = [
        {'時刻': '16:28:40', '商品名': 'おにぎり', '価格': 120},
        {'時刻': '16:25:12', '商品名': 'りんご', '価格': 150},
        {'時刻': '16:22:35', '商品名': 'おにぎり', '価格': 120},
        {'時刻': '16:20:18', '商品名': '牛乳', '価格': 200},
        {'時刻': '16:18:45', '商品名': 'おにぎり', '価格': 120},
        {'時刻': '16:15:23', '商品名': 'りんご', '価格': 150},
        {'時刻': '16:12:56', '商品名': '食パン', '価格': 250},
        {'時刻': '16:10:31', '商品名': 'おにぎり', '価格': 120},
        {'時刻': '16:08:17', '商品名': '牛乳', '価格': 200},
        {'時刻': '16:05:44', '商品名': 'おにぎり', '価格': 120},
    ]

# アプリケーションタイトル
st.title("情報システム体験Webアプリ")
st.caption("Created by Dit-Lab.(Daiki ITO)")
st.caption("Supported by Tomoaki ATSUMI")

st.markdown("---")

# 商品データ
products = {
    'りんご': {'price': 150, 'emoji': '🍎'},
    '牛乳': {'price': 200, 'emoji': '🥛'},
    'おにぎり': {'price': 120, 'emoji': '🍙'},
    '食パン': {'price': 250, 'emoji': '🍞'}
}

def add_to_cart(product_name, price):
    """商品をカートに追加"""
    st.session_state.cart.append({'商品名': product_name, '価格': price})

def process_checkout():
    """レジ会計処理"""
    current_time = datetime.now().strftime("%H:%M:%S")
    for item in st.session_state.cart:
        st.session_state.sales_data.insert(0, {
            '時刻': current_time,
            '商品名': item['商品名'],
            '価格': item['価格']
        })
    st.session_state.cart = []
    st.session_state.current_step = 2

def analyze_sales_data():
    """販売データの分析"""
    df = pd.DataFrame(st.session_state.sales_data)
    product_counts = df['商品名'].value_counts()
    return product_counts

# ステップ1: POSレジでの商品スキャン
if st.session_state.current_step == 1:
    st.header("ステップ1：お客さんの商品をスキャンしよう")
    st.write("あなたはスーパーの店員です。お客様が購入する商品をPOSレジでスキャンしましょう！")
    
    # 商品リスト
    st.subheader("商品リスト")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.write(f"{products['りんご']['emoji']} りんご ({products['りんご']['price']}円)")
        if st.button("スキャン", key="apple"):
            add_to_cart('りんご', products['りんご']['price'])
            st.success("りんごをスキャンしました！")
    
    with col2:
        st.write(f"{products['牛乳']['emoji']} 牛乳 ({products['牛乳']['price']}円)")
        if st.button("スキャン", key="milk"):
            add_to_cart('牛乳', products['牛乳']['price'])
            st.success("牛乳をスキャンしました！")
    
    with col3:
        st.write(f"{products['おにぎり']['emoji']} おにぎり ({products['おにぎり']['price']}円)")
        if st.button("スキャン", key="onigiri"):
            add_to_cart('おにぎり', products['おにぎり']['price'])
            st.success("おにぎりをスキャンしました！")
    
    with col4:
        st.write(f"{products['食パン']['emoji']} 食パン ({products['食パン']['price']}円)")
        if st.button("スキャン", key="bread"):
            add_to_cart('食パン', products['食パン']['price'])
            st.success("食パンをスキャンしました！")
    
    # 買い物かご
    st.subheader("🛒 買い物かご")
    if st.session_state.cart:
        cart_df = pd.DataFrame(st.session_state.cart)
        st.dataframe(cart_df, use_container_width=True)
        total = sum([item['価格'] for item in st.session_state.cart])
        st.write(f"**合計金額: {total}円**")
        
        if st.button("💰 お会計", type="primary"):
            process_checkout()
            st.success("お会計が完了しました！販売データが記録されました。")
            st.rerun()
    else:
        st.write("カートは空です。商品をスキャンしてください。")

# ステップ2: 販売データ確認
elif st.session_state.current_step == 2:
    st.header("ステップ2：記録された「販売データ」を見てみよう")
    st.write("「お会計」ボタンを押すと、今スキャンした情報が「販売データ一覧」に追加されます。これが情報システムの基本となるデータです。")
    
    # 販売データ表示
    st.subheader("📊 販売データ一覧")
    sales_df = pd.DataFrame(st.session_state.sales_data)
    st.dataframe(sales_df, use_container_width=True)
    
    st.info("💡 あなたが先ほど記録したデータが表の一番上に追加されています！")
    
    if st.button("📈 データを分析する", type="primary"):
        st.session_state.current_step = 3
        st.rerun()

# ステップ3: データ分析
elif st.session_state.current_step == 3:
    st.header("ステップ3：データを分析して「売れ筋」を発見！")
    st.write("POSデータを集計すると、どの商品がたくさん売れているかが一目でわかります。")
    
    # データ分析
    product_counts = analyze_sales_data()
    
    # グラフ表示
    st.subheader("📊 商品別売上個数")
    fig = px.bar(
        x=product_counts.index, 
        y=product_counts.values,
        labels={'x': '商品名', 'y': '売上個数'},
        title="商品ごとの売上個数",
        color=product_counts.values,
        color_continuous_scale="viridis"
    )
    fig.update_layout(showlegend=False)
    st.plotly_chart(fig, use_container_width=True)
    
    # 分析結果
    st.subheader("🔍 分析結果")
    most_popular = product_counts.index[0]
    least_popular = product_counts.index[-1]
    
    col1, col2 = st.columns(2)
    with col1:
        st.success(f"🏆 一番人気: **{most_popular}** ({product_counts[most_popular]}個)")
    with col2:
        st.warning(f"📉 売れ行きが良くない: **{least_popular}** ({product_counts[least_popular]}個)")
    
    if st.button("🚚 この分析をもとに商品を発注する", type="primary"):
        st.session_state.current_step = 4
        st.rerun()

# ステップ4: 発注システム
elif st.session_state.current_step == 4:
    st.header("ステップ4：分析結果にもとづいて「発注情報」を作成しよう")
    st.write("分析結果から、人気商品は多めに、不人気商品は少なめに発注する「発注情報」が自動で作成されました。")
    
    # 発注情報の自動生成
    product_counts = analyze_sales_data()
    
    st.subheader("📋 発注情報リスト")
    
    order_info = []
    for product, count in product_counts.items():
        emoji = products[product]['emoji']
        if count >= 4:  # 人気商品
            order_qty = 30
            reason = "在庫が少なくなりそうなので"
        elif count >= 2:  # 普通の商品
            order_qty = 20
            reason = "順調に売れているので"
        else:  # 不人気商品
            order_qty = 0
            reason = "在庫が余っているので"
        
        order_info.append({
            '商品': f"{emoji} {product}",
            '発注数': f"{order_qty}個" if order_qty > 0 else "発注なし",
            '理由': reason
        })
    
    order_df = pd.DataFrame(order_info)
    st.table(order_df)
    
    if st.button("📦 この内容で配送センターに発注する", type="primary"):
        st.session_state.current_step = 5
        st.success("🎉 発注が完了しました！配送センターに情報が送信されました。")
        st.rerun()

# ステップ5: まとめ
elif st.session_state.current_step == 5:
    st.header("ステップ5：まとめ - これが情報システムの力！")
    
    # 情報システムの流れ図
    st.subheader("🔄 情報システムの流れ")
    
    st.markdown("""
    ```
    👥 お客様          🏪 店舗          🚚 配送センター
         |              |                    |
         | ①販売情報     |                    |
         |─────────────→|                    |
         |              | ②データ分析         |
         |              |     ↓             |
         |              | ③発注情報          |
         |              |──────────────────→|
    ```
    """)
    
    # 解説
    st.subheader("📚 解説")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.info("""
        **① 販売情報の記録**
        - お客様が商品を購入
        - POSレジでデータを記録
        - (ステップ1, 2で体験)
        """)
    
    with col2:
        st.success("""
        **② データ分析**
        - 集めたデータを分析
        - 売れ筋商品を把握
        - (ステップ3で体験)
        """)
    
    with col3:
        st.warning("""
        **③ 発注情報の送信**
        - 分析結果に基づいて発注
        - 配送センターに注文
        - (ステップ4で体験)
        """)
    
    st.markdown("---")
    
    st.success("""
    🎯 **情報システムとは？**
    
    顧客の行動から得た情報（データ）を分析し、次の行動（発注）に活かす仕組み全体が「情報システム」です。
    
    この情報の流れによって、スーパーは：
    - 📈 無駄な在庫を減らせる
    - 🎯 お客様が欲しい商品をいつでも提供できる
    - 💰 効率的な店舗運営ができる
    
    あなたも今回の体験で、情報システムの基本的な流れを理解できましたね！
    """)
    
    if st.button("🔄 もう一度最初から体験する"):
        st.session_state.current_step = 1
        st.session_state.cart = []
        st.rerun()

